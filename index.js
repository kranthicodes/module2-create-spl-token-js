import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fromWallet = Keypair.generate();
  const toWallet = Keypair.generate();

  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(fromAirdropSignature, {
    commitment: "confirmed",
  });

  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9
  );
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  let signature = await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    1000000000,
    []
  );

  console.log("mint tx:", signature);

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet.publicKey
  );

  signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    1000000000,
    []
  );
  console.log("transfer tx:", signature);
})();
