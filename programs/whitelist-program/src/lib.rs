use anchor_lang::prelude::*;
use std::str::FromStr;

declare_id!("AD2x2eG2t9rzHRMSDGYCm2Lh58BjKRUTpcM2mVym71ua");

#[program]
pub mod whitelist_program {
    use super::*;

    pub fn initialize_whitelist(ctx: Context<InitializeWhitelist>)->Result<()>{
        let whitelist = &mut ctx.accounts.whitelist;
        whitelist.addresses = Vec::new();
        Ok(())
    }

    pub fn add_to_whitelist(ctx: Context<AddToWhitelist>,address:Pubkey)->Result<()>{
        let whitelist = &mut ctx.accounts.whitelist;
        let admin_pubkey = Pubkey::from_str("Fh35FkLQL6evt4u8TvvmZN7Vq7cXrwKvy1esmxivhd5J").map_err(|_| CustomError::NotAdmin)?;
        require!(ctx.accounts.admin.key() == admin_pubkey, CustomError::NotAdmin);
        if !whitelist.addresses.contains(&address){
            whitelist.addresses.push(address);
        }
        else {
            return Err(CustomError::AlreadyInWhitelist.into());
        }
        Ok(())
    }

    pub fn remove_from_whitelist(ctx: Context<RemoveFromWhitelist>,address:Pubkey)->Result<()>{
        let whitelist = &mut ctx.accounts.whitelist;
        if whitelist.addresses.contains(&address){
            whitelist.addresses.retain(|&x| x != address);
        }
        Ok(())
    }

    pub fn verify_whitelist(ctx: Context<VerifyWhitelist>)->Result<()>{
        let whitelist =  &ctx.accounts.whitelist;
        let caller = &ctx.accounts.caller;
        require!(whitelist.addresses.contains(&caller.key()),CustomError::NotInWhitelist);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeWhitelist<'info>{
    // 8 bytes for the length of the array and 32 bytes for each address max 100 addresses. PDA is created with the seed "whitelist"
    #[account(init,payer = admin, space = 8 + 32 *100,seeds = [b"whitelist"],bump)]
    pub whitelist: Account<'info, Whitelist>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info,System>,
}
#[derive(Accounts)]
pub struct AddToWhitelist<'info>{
    #[account(mut,seeds = [b"whitelist"],bump)]
    pub whitelist: Account<'info, Whitelist>,
    pub admin: Signer<'info>,
}
#[derive(Accounts)]
pub struct RemoveFromWhitelist<'info>{
    #[account(mut,seeds = [b"whitelist"],bump)]
    pub whitelist: Account<'info, Whitelist>,
    pub admin: Signer<'info>,
}
#[derive(Accounts)]
pub struct VerifyWhitelist<'info>{
    #[account(seeds = [b"whitelist"],bump)]
    pub whitelist: Account<'info, Whitelist>,
    pub caller: Signer<'info>,
}
#[account]
pub struct Whitelist{
    pub addresses: Vec<Pubkey>,
}
#[error_code]
pub enum CustomError{
    #[msg("You are not an admin")]
    NotAdmin,
    #[msg("Address is already in whitelist")]
    AlreadyInWhitelist,
    #[msg("Address is not in whitelist")]
    NotInWhitelist,
}