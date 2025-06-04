(function () {

    const wfsTileAction = 'viewWebClock';
    const wfsssologinurl = "/sf/idp-init/sso/wfs-sso-login-done?saml2=true&RelayState=True";

    let tileSize = ''.toLowerCase(); 
    let dialogWidth;

    switch (tileSize) {
        case 'sm':
        case 'small':
            dialogWidth = '37.5%';
            break;
        case 'md':
        case 'medium':
            dialogWidth = '50%';
            break;
        case 'lg':
        case 'large':
            dialogWidth = '64%';
            break;
        case 'xl':
        case 'xlarge':
            dialogWidth = '80%';
            break;
        default:
            dialogWidth = 'auto';
    }

    const wfsBaseUrl = "https://bancobmg-prod.wta-us8.wfs.cloud/workforce/";

    // create dialog element
    const dialog = document.createElement("ui5-dialog");
    dialog.id = 'wfsCustomDialog';
    dialog.setAttribute("header-text", 'Relógio da Web');
    dialog.style.zIndex = "1000";
    dialog.style.display = 'flex';
    dialog.style.width = dialogWidth;

    // create loading div
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'sfLoadingContainer';
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.left = '50%';
    const loadingSpan = document.createElement('span');
    loadingSpan.className = 'globalContentForegroundVariant globalContentBackgroundVariant';
    loadingSpan.style.position = 'relative';
    loadingSpan.style.left = '-50%';
    loadingSpan.innerHTML = 'Loading...';
    loadingDiv.appendChild(loadingSpan);
    dialog.appendChild(loadingDiv);

    // create tile container
    const p = document.createElement('p');
    const wfsCustomTile = document.createElement('div');
    wfsCustomTile.className = 'wfsCustomTile';
    wfsCustomTile.setAttribute('wfsBaseUrl', wfsBaseUrl);
    wfsCustomTile.setAttribute('wfsTileAction', wfsTileAction);
    wfsCustomTile.setAttribute('wfsssologinurl', wfsssologinurl);
    wfsCustomTile.setAttribute('onprocessedhandler', 'console.log("' + wfsTileAction + ' tile processed");');
    wfsCustomTile.setAttribute('height', '240px');
    wfsCustomTile.setAttribute('width', '288px');
    p.appendChild(wfsCustomTile);
    dialog.appendChild(p);

    // create footer button with fix
    const footerBtn = document.createElement("ui5-button");
    footerBtn.setAttribute("slot", "footer");
    footerBtn.innerHTML = "Fechar";

    footerBtn.addEventListener("click", function () {
        dialog.style.setProperty('display', 'none', 'important');
        setTimeout(() => {
            if (dialog && dialog.parentNode) {
                dialog.parentNode.removeChild(dialog);
            }
        }, 500);
    });

    dialog.appendChild(footerBtn);

    // add dialog to DOM and open
    document.body.appendChild(dialog);
    dialog.open = true;

    // server fallback
    const serverUnavailableCheck = function () {
        if (typeof WfsSSOLoginManager === 'undefined') {
            let style = window.getComputedStyle(document.body);
            let messageDiv = document.createElement('div');
            messageDiv.style.margin = '8px';
            messageDiv.style.fontFamily = style.fontFamily;
            messageDiv.style.fontSize = style.fontSize;
            messageDiv.innerHTML = 'The server could not be reached';
            let sfLoadingContainer = dialog.getElementsByClassName('sfLoadingContainer')[0];
            if (sfLoadingContainer) {
                dialog.replaceChild(messageDiv, sfLoadingContainer);
            }
        }
    };

    setTimeout(serverUnavailableCheck, 10000);

    // load WFS script if needed
    if (!document.getElementById('wfsSSOLoginManager')) {
        let wfsSSOLoginManagerScript = document.createElement('script');
        wfsSSOLoginManagerScript.id = 'wfsSSOLoginManager';
        wfsSSOLoginManagerScript.type = 'text/javascript';
        wfsSSOLoginManagerScript.src = wfsBaseUrl + 'SuccessFactors.do?action=wfsSSOLoginManager';
        document.head.appendChild(wfsSSOLoginManagerScript);
    } else if (typeof WfsSSOLoginManager !== 'undefined' && WfsSSOLoginManager.isTilePollingComplete()) {
        WfsSSOLoginManager.restartTilePolling();
    }

})();
