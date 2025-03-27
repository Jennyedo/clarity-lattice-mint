import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test minting lattice NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Test valid mint
        let block = chain.mineBlock([
            Tx.contractCall('lattice-mint', 'mint-lattice', [
                types.uint(3),
                types.uint(3),
                types.ascii("111000111")
            ], deployer.address)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Test invalid dimensions
        block = chain.mineBlock([
            Tx.contractCall('lattice-mint', 'mint-lattice', [
                types.uint(0),
                types.uint(3),
                types.ascii("111000111")
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(101);
    }
});

Clarinet.test({
    name: "Test getting lattice data",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Mint NFT first
        let block = chain.mineBlock([
            Tx.contractCall('lattice-mint', 'mint-lattice', [
                types.uint(2),
                types.uint(2),
                types.ascii("1100")
            ], deployer.address)
        ]);
        
        // Get data
        let response = chain.callReadOnlyFn(
            'lattice-mint',
            'get-lattice-data',
            [types.uint(1)],
            deployer.address
        );
        
        let data = response.result.expectOk().expectTuple();
        assertEquals(data['width'], types.uint(2));
        assertEquals(data['height'], types.uint(2));
        assertEquals(data['data'], types.ascii("1100"));
    }
});

Clarinet.test({
    name: "Test transferring lattice NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall('lattice-mint', 'mint-lattice', [
                types.uint(2),
                types.uint(2),
                types.ascii("1100")
            ], deployer.address)
        ]);
        
        // Transfer NFT
        block = chain.mineBlock([
            Tx.contractCall('lattice-mint', 'transfer', [
                types.uint(1),
                types.principal(deployer.address),
                types.principal(wallet1.address)
            ], deployer.address)
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Verify owner
        let response = chain.callReadOnlyFn(
            'lattice-mint',
            'get-owner',
            [types.uint(1)],
            deployer.address
        );
        response.result.expectOk().expectSome().expectPrincipal(wallet1.address);
    }
});
