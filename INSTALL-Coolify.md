Para implantar no Coolify:

Frontend:

# No Coolify, crie um novo serviço Docker
- Nome: gestly-frontend
- Dockerfile: Dockerfile.frontend
- Porta: 5173

API:

# Crie outro serviço Docker  
- Nome: gestly-api
- Dockerfile: Dockerfile.api
- Porta: 3000

Configure as variáveis de ambiente para cada serviço no Coolify

Implante os serviços:

```bash
# Frontend
git push coolify main

# API 
git push coolify main
```

Benefícios desta abordagem:

- Escalabilidade independente
- Melhor isolamento
- Facilita manutenção
- Permite diferentes ciclos de deploy
- Melhor monitoramento

Você pode começar com a implantação monolítica e migrar para separada conforme necessário. O importante é configurar corretamente as variáveis de ambiente e garantir que a comunicação entre frontend e API funcione.