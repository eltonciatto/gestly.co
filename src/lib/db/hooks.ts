import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDB } from './index'
import type { User } from './types'

// User hooks
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getDB().auth.getUser()
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const user = await getDB().auth.getUser()
      if (!user) throw new Error('No user found')
      
      return getDB().db.from('users')
        .update(data)
        .eq('id', user.id)
        .single()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}

// Profile hooks
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getDB().db.from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),
    enabled: !!userId
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const user = await getDB().auth.getUser()
      if (!user) throw new Error('No user found')
      
      return getDB().db.from('profiles')
        .update(data)
        .eq('id', user.id)
        .single()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

// Business hooks
export function useBusiness(businessId?: string) {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: () => getDB().db.from('businesses')
      .select('*')
      .eq('id', businessId)
      .single(),
    enabled: !!businessId
  })
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const user = await getDB().auth.getUser()
      if (!user) throw new Error('No user found')
      
      return getDB().db.from('businesses')
        .update(data)
        .eq('owner_id', user.id)
        .single()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] })
    }
  })
}