const popup = document.querySelector<HTMLDialogElement>("#popup")!;
const title = document.querySelector("#popup-title")!;
const btnYes = document.querySelector("#btn-yes")!;
const btnNo = document.querySelector("#btn-no")!;

export function createPopup(text: string) {
  return new Promise(res => {
    title.textContent = text;
    popup.showModal();
    btnYes.addEventListener("click", () => {
      popup.close();
      res(true);
    });
    btnNo.addEventListener("click", () => {
      popup.close();
      res(false);
    });
  });
}
