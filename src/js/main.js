import "/styles/style.scss";
import "/styles/signUp.scss";
import "/styles/login.scss";
import "/components/login-modal/login-modal.js";
import "/js/auth.js";
import "/js/highlight.js";
import "/js/webBasic.js";

if(import.meta.env?.VITE_BACKEND_URL){
    window.runtimeConfig.backendUrl = import.meta.env.VITE_BACKEND_URL
}
