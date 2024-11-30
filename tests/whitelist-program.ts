import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WhitelistProgram } from "../target/types/whitelist_program"; // Akıllı kontrat tipi

describe("whitelist_program", () => {
  // Anchor sağlayıcısını ayarla
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WhitelistProgram as Program<WhitelistProgram>;

  // Whitelist PDA ve bump değerleri
  const [whitelistPda, whitelistBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("whitelist")],
    program.programId
  );

  // Admin anahtarı (Test için, Anchor cüzdanından alınır)
  const admin = provider.wallet.publicKey;

  // Rastgele adresler oluşturuluyor
  const randomAddress1 = anchor.web3.Keypair.generate().publicKey;
  const randomAddress2 = anchor.web3.Keypair.generate().publicKey;

  it("Initializes the whitelist", async () => {
    // Whitelist oluştur
    const tx = await program.methods
      .initializeWhitelist()
      .accounts({
        whitelist: whitelistPda,
        admin,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Initialized whitelist transaction:", tx);
  });

  it("Adds an address to the whitelist", async () => {
    // Whitelist'e adres ekle
    const tx = await program.methods
      .addToWhitelist(randomAddress1)
      .accounts({
        whitelist: whitelistPda,
        admin,
      })
      .rpc();

    console.log("Added to whitelist transaction:", tx);
  });

  it("Fails to add the same address to the whitelist again", async () => {
    // Aynı adres tekrar eklenmeye çalışılırsa hata vermeli
    try {
      await program.methods
        .addToWhitelist(randomAddress1)
        .accounts({
          whitelist: whitelistPda,
          admin,
        })
        .rpc();
    } catch (err) {
      console.log("Expected error for duplicate address:", err.message);
    }
  });

  it("Removes an address from the whitelist", async () => {
    // Whitelist'ten adres çıkar
    const tx = await program.methods
      .removeFromWhitelist(randomAddress1)
      .accounts({
        whitelist: whitelistPda,
        admin,
      })
      .rpc();

    console.log("Removed from whitelist transaction:", tx);
  });

  it("Verifies that an address is not in the whitelist", async () => {
    // Whitelist doğrulama (olmayan adres için hata beklenir)
    try {
      await program.methods
        .verifyWhitelist()
        .accounts({
          whitelist: whitelistPda,
          caller: randomAddress1,
        })
        .rpc();
    } catch (err) {
      console.log("Expected error for non-whitelisted address:", err.message);
    }
  });

  it("Verifies that an address is in the whitelist", async () => {
    // Yeni bir Keypair oluştur
    const caller = anchor.web3.Keypair.generate();
  
    // Adresi whitelist'e ekle
    await program.methods
      .addToWhitelist(caller.publicKey)
      .accounts({
        whitelist: whitelistPda,
        admin,
      })
      .signers([provider.wallet.payer]) // Admin imzası sağlanıyor
      .rpc();
  
    // Whitelist'teki adresi doğrula
    const tx = await program.methods
      .verifyWhitelist()
      .accounts({
        whitelist: whitelistPda,
        caller: caller.publicKey,
      })
      .signers([caller]) // Caller imzası sağlanıyor
      .rpc();
  
    console.log("Verified whitelist address transaction:", tx);
  });
  
});

