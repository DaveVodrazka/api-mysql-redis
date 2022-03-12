import { getData, postData } from "./modules/sendRequest";

const buttonTest = document.getElementById("send-request");
const buttonName = document.getElementById("send-name-request");
const textArea = document.getElementById("name-input");

const getName = () => textArea.value;

buttonTest.addEventListener("click", () => getData("name"));
buttonName.addEventListener("click", () => postData("post-name", { name: getName() }));
