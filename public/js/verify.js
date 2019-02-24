const form = document.getElementById("verify_form");

let digits = form.querySelectorAll(".digits input");
let btn = form.querySelector("input[type=\"submit\"]");

// for (let d of digits) {
//     d.addEventListener('input', function (e) {
//         if (e.target.value.length > 0) {
//             if (e.target.value.length > 1) {
//                 e.target.value = e.target.value.substr(0,1);
//             }
//             if (d.nextElementSibling) {
//                 d.nextElementSibling.focus();
//             }
            
//         } else if (e.target.value.length == 0) {
//             if (d.previousElementSibling) {
//                 d.previousElementSibling.focus();
//             }
//         }
//         checkAll();
//     });
// }

digits[0].addEventListener("input",  checkAll);
function checkAll() {
    let filled = Array.from(digits).every(x => {
        return x.value.length == 6;
    });
    if (filled) {
        btn.classList.add("is-link");
        btn.classList.remove("is-static");
    } else {
        btn.classList.add("is-static");
        btn.classList.remove("is-link");
    }
}