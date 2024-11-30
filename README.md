
# Whitelist Program

**Whitelist Program** is a smart contract built on the Solana blockchain using the **Anchor** framework. This program enables the addition of specific addresses to a whitelist, removal of addresses from the whitelist, and verification of whether an address is on the whitelist.

## Features

- **Initialize Whitelist**: Creates the initial whitelist PDA (Program Derived Address).
- **Add Address to Whitelist**: Allows the admin to add a new address to the whitelist.
- **Remove Address from Whitelist**: Allows the admin to remove an address from the whitelist.
- **Verify Whitelist**: Verifies if a given address is on the whitelist.

## Requirements

To run this project, you'll need the following tools:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Anchor Framework](https://project-serum.github.io/anchor/getting-started/introduction.html)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

## Setup

1. **Clone the Project**:
   ```bash
   git clone https://github.com/your-username/whitelist-program.git
   cd whitelist-program
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```

3. **Build the Project**:
   ```bash
   anchor build
   ```

4. **Start the Test Validator**:
   ```bash
   solana-test-validator
   ```

5. **Run Anchor Tests**:
   ```bash
   anchor test
   ```

## Usage

### Anchor Methods

1. **Initialize Whitelist**
   - `initialize_whitelist()`: Creates a whitelist PDA.
   
2. **Add Address to Whitelist**
   - `add_to_whitelist(address: Pubkey)`: Adds the specified address to the whitelist.
   
3. **Remove Address from Whitelist**
   - `remove_from_whitelist(address: Pubkey)`: Removes the specified address from the whitelist.
   
4. **Verify Whitelist**
   - `verify_whitelist()`: Checks if a given address is in the whitelist.

### Tests

The tests are written using `mocha` and Anchor's testing tools. To run the tests:

```bash
anchor test
```

#### Test Coverage:
- Correct initialization of the whitelist.
- Adding an address to the whitelist.
- Ensuring duplicate addresses cannot be added to the whitelist.
- Removing an address from the whitelist.
- Verifying an address in the whitelist.

## Technical Details

- **Whitelist PDA**: The PDA is derived using the seed `"whitelist"` and the program ID.
- **Storage**: The whitelist uses `Vec<Pubkey>` to store addresses, supporting a maximum of 100 addresses.
- **Admin Control**: Only the designated admin (`Fh35FkLQL6evt4u8TvvmZN7Vq7cXrwKvy1esmxivhd5J`) can manage the whitelist.If you want to try the test codes yourself, replace the address with the public address of the private key pair in the file “~/.config/solana/id.json” or the test codes will fail.

## Security Precautions

1. **Do Not Share Admin Key**: The admin key used in the tests should remain confidential.
2. **Exclude Private Keys (.json)**: Ensure you add sensitive files like Solana wallet `.json` files to `.gitignore` to prevent accidental exposure.

## License

This project is licensed under the [MIT License](LICENSE).

---
