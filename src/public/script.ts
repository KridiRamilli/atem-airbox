const ipInputs: NodeListOf<HTMLElement> =
  document.querySelectorAll('[data-id*="-ip"]');
window.addEventListener("load", () => {
  ipInputs.forEach((el) => {
    Inputmask("ip").mask(el);
  });
});

interface ToastProps {
  text: string;
  duration?: number;
  isError: boolean;
}

const infoToast = (args: ToastProps) => {
  const { text, duration = 3000, isError } = args;
  //@ts-ignore
  Toastify({
    text,
    duration,
    destination: "",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: isError
        ? "linear-gradient(to right, #f44336, #ff5252)"
        : "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};

infoToast({
  text: "Une jam success",
  isError: false,
});

infoToast({
  text: "Une jam error",
  duration: 6000,
  isError: true,
});
