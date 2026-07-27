// ລະບົບແຈ້ງເຕືອນແບບ custom modal dialog (ບໍ່ໃຊ້ SweetAlert ແລ້ວ)
// ໃຊ້ store ນ້ອຍໆ + <NotificationModal /> ທີ່ mount ໄວ້ໃນ layout ເປັນຄົນ render

let listener = null;
let resolver = null;

function show(config) {
  return new Promise((resolve) => {
    resolver = resolve;
    if (listener) listener(config);
    else resolve({ isConfirmed: false });
  });
}

// ໃຫ້ <NotificationModal /> ມາ subscribe
export function subscribeAlert(fn) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

// ໃຫ້ <NotificationModal /> ເອີ້ນເມື່ອຜູ້ໃຊ້ກົດປຸ່ມ
export function resolveAlert(isConfirmed) {
  const r = resolver;
  resolver = null;
  if (r) r({ isConfirmed });
}

export function notifySuccess(title, text = "") {
  return show({ variant: "success", title, text, confirmText: "OK" });
}

export function notifyError(message) {
  return show({
    variant: "error",
    title: "Oops...",
    text: message || "Something went wrong",
    confirmText: "OK",
  });
}

export function confirmDelete(text = "This action cannot be undone.") {
  return show({
    variant: "confirm",
    title: "ຢືນຢັນການລຶບ",
    text,
    confirmText: "ລຶບ",
    cancelText: "ຍົກເລີກ",
  });
}
