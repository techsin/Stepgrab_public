const form = document.getElementById("gradual_discounts");

let rows = form.querySelectorAll("tbody tr");

for (let row of rows) {
    let [left, right] = row.querySelectorAll("input");
    left.addEventListener("input", function(e){
        if (e.target.value.length > 0) {
            right.value = "";
        }
        if (parseFloat(e.target.value) > 100) {
            left.value = 100;
        }
    });
    right.addEventListener("input", function(e){
        if (e.target.value.length > 0) {
            left.value = "";
        }
    });
}
