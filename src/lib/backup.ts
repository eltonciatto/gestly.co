import { supabase } from './supabase';
import { logAuditEvent, AuditAction } from './audit';

interface BackupMetadata {
  timestamp: string;
  tables: string[];
  size: number;
  checksum: string;
}

export async function createBackup(businessId: string, userId: string): Promise<BackupMetadata> {
  try {
    // Tabelas para backup
    const tables = [
      'businesses',
      'customers',
      'services',
      'appointments',
      'avaliacoes',
      'programas_fidelidade',
      'pontos_fidelidade',
      'recompensas',
      'resgates',
      'notification_templates',
      'horarios_funcionamento',
      'dias_especiais',
      'metricas_diarias'
    ];

    const backup: Record<string, any> = {};
    
    // Fazer backup de cada tabela
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('business_id', businessId);

      if (error) throw error;
      backup[table] = data;
    }

    // Gerar metadados do backup
    const backupString = JSON.stringify(backup);
    const metadata: BackupMetadata = {
      timestamp: new Date().toISOString(),
      tables,
      size: new Blob([backupString]).size,
      checksum: await generateChecksum(backupString)
    };

    // Salvar backup no storage
    const { error: uploadError } = await supabase.storage
      .from('backups')
      .upload(
        `${businessId}/${metadata.timestamp}.json`,
        backupString,
        {
          contentType: 'application/json',
          cacheControl: '3600'
        }
      );

    if (uploadError) throw uploadError;

    // Registrar evento de auditoria
    await logAuditEvent({
      action: AuditAction.BACKUP,
      resource: 'backup',
      resource_id: metadata.timestamp,
      user_id: userId,
      business_id: businessId,
      details: {
        tables: metadata.tables,
        size: metadata.size
      }
    });

    return metadata;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

export async function restoreBackup(
  businessId: string,
  userId: string,
  timestamp: string
): Promise<void> {
  try {
    // Buscar backup do storage
    const { data, error: downloadError } = await supabase.storage
      .from('backups')
      .download(`${businessId}/${timestamp}.json`);

    if (downloadError) throw downloadError;

    const backupContent = await data.text();
    const backup = JSON.parse(backupContent);

    // Iniciar transação
    const { error: txError } = await supabase.rpc('begin_transaction');
    if (txError) throw txError;

    try {
      // Restaurar cada tabela
      for (const [table, records] of Object.entries(backup)) {
        // Limpar dados existentes
        await supabase
          .from(table)
          .delete()
          .eq('business_id', businessId);

        // Inserir dados do backup
        if (records.length > 0) {
          const { error } = await supabase
            .from(table)
            .insert(records);

          if (error) throw error;
        }
      }

      // Commit da transação
      await supabase.rpc('commit_transaction');

      // Registrar evento de auditoria
      await logAuditEvent({
        action: AuditAction.RESTORE,
        resource: 'backup',
        resource_id: timestamp,
        user_id: userId,
        business_id: businessId,
        details: {
          timestamp,
          tables: Object.keys(backup)
        }
      });
    } catch (error) {
      // Rollback em caso de erro
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
}

async function generateChecksum(content: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}