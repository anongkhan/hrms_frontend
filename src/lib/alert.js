import Swal from "sweetalert2";

// ກ່ອງແຈ້ງເຕືອນກາງຈໍ (center popup)

export function notifySuccess(title, text = "") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: { popup: "rounded-3xl" },
  });
}

export function notifyError(message) {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message || "Something went wrong",
    confirmButtonColor: "#2563eb",
    confirmButtonText: "OK",
    customClass: { popup: "rounded-3xl" },
  });
}

export function confirmDelete(text = "This action cannot be undone.") {
  return Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    customClass: { popup: "rounded-3xl" },
  });
}
