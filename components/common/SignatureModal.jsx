import { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { useSelector } from "react-redux";
import { mergePDFWithSignature } from "@/utils/pdfDocument";
import { toast } from "react-toastify";

export default function SignatureModal({
  loading,
  isOpen,
  onClose,
  onSave,
  contractId,
  contractDocument,
}) {
  const sigPadRef = useRef(null);
  const token = useSelector((state) => state.currentUser.token);
  const user = useSelector((state) => state.currentUser.user);

  const handleSave = async () => {
    if (sigPadRef.current.isEmpty()) {
      toast.error("Please Provide A Signature!");
      return;
    }

    try {
      loading();
      onClose();
      const signatureData = sigPadRef.current.toDataURL();
      const contractorName = `${user.firstName} ${user.lastName}`;

      const date = new Date(Date.now()).toISOString().split("T")[0];
      const signedPdfBlob = await mergePDFWithSignature(
        contractDocument,
        signatureData,
        date,
        contractorName
      );

      const formData = new FormData();
      formData.append("signedContract", signedPdfBlob);
      formData.append("contractId", contractId);

      const response = await fetch("/api/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error);
        throw new Error("Failed To Save Signature!");
      }

      onSave();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message || "Failed To Save Signature!");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="signature-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Sign Contract
        </h2>

        <div
          className="signature-pad-container"
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            margin: "20px 0",
            backgroundColor: "#fff",
          }}
        >
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{
              className: "signature-pad",
              style: {
                width: "100%",
                height: "200px",
                backgroundColor: "#fff",
                borderRadius: "4px",
              },
            }}
          />
        </div>

        <div
          className="button-group"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => sigPadRef.current.clear()}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f47920",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Signature
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
