import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export async function ensureUserProvisioned(user: User) {
  if (!user) return { profileId: null as string | null, type: null as 'business' | 'community' | null };

  // Try to find an existing private profile (owned by this user)
  const { data: existingProfile, error: fetchErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let profileId = existingProfile?.id as string | undefined;
  const metadataType = (user.user_metadata?.type as 'business' | 'community' | undefined) ?? undefined;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? undefined;

  // Create profile (and type-specific row) via RPC if missing
  if (!profileId && metadataType) {
    const { data: rpcProfileId, error: rpcErr } = await supabase.rpc('create_user_profile', {
      user_id: user.id,
      profile_type: metadataType,
      display_name: displayName ?? null,
      user_email: (user.email as string | null) ?? null,
    });
    if (rpcErr) throw rpcErr;
    profileId = rpcProfileId as string;
  }

  // Fallback: if still no profileId (e.g., metadataType missing), attempt creating a bare profile row (RLS requires auth)
  if (!profileId) {
    const { data: created, error: createErr } = await supabase
      .from('profiles')
      .insert({ email: user.email ?? undefined } as any)
      .select('id')
      .single();
    if (createErr) throw createErr;
    profileId = created.id as string;
  }

  // Ensure type-specific table exists based on metadata
  if (metadataType === 'business') {
    const { data: biz } = await supabase.from('business_profiles').select('profile_id').eq('profile_id', profileId).maybeSingle();
    if (!biz) {
      const { error: createBizErr } = await supabase
        .from('business_profiles')
        .insert({ profile_id: profileId, name: displayName ?? undefined });
      if (createBizErr) throw createBizErr;
    }
  } else if (metadataType === 'community') {
    const { data: com } = await supabase.from('community_profiles').select('profile_id').eq('profile_id', profileId).maybeSingle();
    if (!com) {
      const { error: createComErr } = await supabase
        .from('community_profiles')
        .insert({ profile_id: profileId, name: displayName ?? undefined });
      if (createComErr) throw createComErr;
    }
  }

  return { profileId: profileId ?? null, type: (metadataType ?? null) };
}
