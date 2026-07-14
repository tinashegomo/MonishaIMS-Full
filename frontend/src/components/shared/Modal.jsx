import { X } from "lucide-react";

/**
 * Modal — closes using onBlur + relatedTarget, the same pattern used
 * for dropdowns, instead of "click backdrop + stopPropagation".
 *
 * How it works:
 *   - The modal BOX itself is made focusable (tabIndex={-1}) and grabs
 *     focus the moment it opens (autoFocus).
 *   - onBlur fires whenever focus leaves the box. relatedTarget tells us
 *     WHERE focus is going next. If it's going somewhere outside the
 *     box (the backdrop, or nothing), we close. If it's going to
 *     something still inside the box (a button, an input), we don't.
 *   - Buttons inside the modal use onMouseDown (not onClick) for the
 *     same reason as dropdowns: mousedown fires BEFORE blur, so the
 *     button's own action still runs even though blur is about to close
 *     the modal.
 */
export default function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        tabIndex={-1}
        autoFocus
        onBlur={(e) => {
          // e.currentTarget = the modal box (because tabIndex/onBlur are on it)
          // e.relatedTarget = whatever element is ABOUT to receive focus
          if (!e.currentTarget.contains(e.relatedTarget)) {
            onClose();
          }
        }}
        className={`w-full max-w-md rounded-lg bg-white p-24 shadow-lg outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ onClose, children, className = "" }) {
  return (
    <div className={`mb-20 flex items-center justify-between ${className}`}>
      <h2 className="text-h4 font-semibold text-text-primary">{children}</h2>
      {onClose && (
        <button
          type="button"
          // onMouseDown, not onClick — fires before the box's onBlur closes it
          onMouseDown={onClose}
          className="rounded-input p-8 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="h-18 w-18" />
        </button>
      )}
    </div>
  );
}

function ModalBody({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function ModalFooter({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-end gap-12 pt-4 ${className}`}>
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
