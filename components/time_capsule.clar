(define-data-var next-id uint u1)
(define-data-var capsules
  (map uint
    {
      owner: principal,
      recipient: principal,
      content: (buff 200),
      unlock-block: uint,
      unlock-stx: uint,
      status: uint
    }
  )
)

(define-constant STATUS_PENDING u0)
(define-constant STATUS_LOCKED u1)
(define-constant STATUS_UNLOCKED u2)
(define-constant STATUS_CANCELLED u3)

;; Tạo capsule mới
(define-public (create-capsule (recipient principal) (content (buff 200)) (unlock-block uint) (unlock-stx uint))
  (let ((id (var-get next-id)))
    (begin
      (map-set capsules id {
        owner: tx-sender,
        recipient: recipient,
        content: content,
        unlock-block: unlock-block,
        unlock-stx: unlock-stx,
        status: STATUS_PENDING
      })
      (var-set next-id (+ id u1))
      (ok id)
    )
  )
)

;; Khóa capsule
(define-public (lock-capsule (id uint))
  (let ((capsule (unwrap-panic (map-get? capsules id))))
    (if (and (is-eq (get owner capsule) tx-sender)
             (is-eq (get status capsule) STATUS_PENDING))
        (begin
          (map-set capsules id (merge capsule { status: STATUS_LOCKED }))
          (ok true)
        )
        (err u1)
    )
  )
)

;; Mở capsule
(define-public (unlock-capsule (id uint))
  (let ((capsule (unwrap-panic (map-get? capsules id))))
    (if (and (is-eq (get recipient capsule) tx-sender)
             (>= block-height (get unlock-block capsule))
             (is-eq (get status capsule) STATUS_LOCKED))
        (begin
          (map-set capsules id (merge capsule { status: STATUS_UNLOCKED }))
          (ok true)
        )
        (err u2)
    )
  )
)

;; Hủy capsule
(define-public (cancel-capsule (id uint))
  (let ((capsule (unwrap-panic (map-get? capsules id))))
    (if (and (is-eq (get owner capsule) tx-sender)
             (is-eq (get status capsule) STATUS_PENDING))
        (begin
          (map-set capsules id (merge capsule { status: STATUS_CANCELLED }))
          (ok true)
        )
        (err u3)
    )
  )
)
