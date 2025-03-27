;; Define NFT token
(define-non-fungible-token lattice-nft uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-dimensions (err u101))
(define-constant err-invalid-lattice (err u102))
(define-constant err-nft-not-found (err u103))

;; Data structure for lattice metadata
(define-map lattice-data uint {
    width: uint,
    height: uint,
    data: (string-ascii 256)
})

;; NFT counter
(define-data-var nft-id-counter uint u0)

;; Helper function to validate lattice dimensions and data
(define-private (validate-lattice (width uint) (height uint) (data (string-ascii 256)))
    (let ((expected-length (* width height)))
        (if (and (> width u0) 
                (> height u0) 
                (<= expected-length u256)
                (is-eq (len data) expected-length))
            (ok true)
            err-invalid-dimensions
        )
    )
)

;; Mint new lattice NFT
(define-public (mint-lattice (width uint) (height uint) (data (string-ascii 256)))
    (let ((new-id (+ (var-get nft-id-counter) u1)))
        (try! (validate-lattice width height data))
        (try! (nft-mint? lattice-nft new-id tx-sender))
        (map-set lattice-data new-id {
            width: width,
            height: height,
            data: data
        })
        (var-set nft-id-counter new-id)
        (ok new-id)
    )
)

;; Transfer lattice NFT
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (try! (nft-transfer? lattice-nft token-id sender recipient))
        (ok true)
    )
)

;; Get lattice data
(define-read-only (get-lattice-data (token-id uint))
    (match (map-get? lattice-data token-id)
        success (ok success)
        failure err-nft-not-found
    )
)

;; Get owner of lattice NFT
(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? lattice-nft token-id))
)
