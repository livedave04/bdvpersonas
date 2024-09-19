let flag = true;
function ver(){
    if (flag) {
        document.getElementById("mat-input-1").type = "password";
        flag = false;
    } else {
                document.getElementById("mat-input-1").type = "text";
                flag = true;

    }
    }
