(define-data-var capsules (list 100 { 
    id: uint, 
    owner: principal, 
    recipient: principal, 
    content: (buff 200), 
    unlock-block: uint, 
    status: uint 
}) (list))

(define-constant STATUS_PENDING u0)
(define-constant STATUS_LOCKED u1)
(define-constant STATUS_UNLOCKED u2)

;; Tạo capsule mới
(define-public (create-capsule (recipient principal) (content (buff 200)) (unlock-block uint))
  (let ((new-id (+ (len (var-get capsules)) u1)))
    (begin
      (var-set capsules (append (var-get capsules) (list { 
        id: new-id, 
        owner: tx-sender, 
        recipient: recipient, 
        content: content, 
        unlock-block: unlock-block, 
        status: STATUS_PENDING 
      })))
      (ok new-id)
    )
  )
)

;; Mở capsule
(define-public (unlock-capsule (capsule-id uint))
  (let ((capsule (element-at (var-get capsules) (- capsule-id u1))))
    (if (and (is-eq (get recipient capsule) tx-sender)
             (>= block-height (get unlock-block capsule))
             (is-eq (get status capsule) STATUS_PENDING))
        (begin
          (var-set capsules
            (set-element (var-get capsules) (- capsule-id u1)
              (merge capsule { status: STATUS_UNLOCKED })
            )
          )
          (ok true)
        )
        (err u1)
    )
  )
)
