(function() {
  var iframeId = 'ai-avatar-iframe-' + Math.random().toString(36).substr(2, 9);
  var iframe = document.createElement('iframe');
  var baseUrl = 'https://copy-of-video-avatar-configurator-622291485897.us-west1.run.app/?mode=embedded';
  
  iframe.id = iframeId;
  iframe.src = baseUrl;
  iframe.title = 'AI Video Avatar';
  iframe.setAttribute('allow', 'microphone');
  
  // Inject Responsive Styles
  var style = document.createElement('style');
  style.textContent = `
    #${iframeId} {
        border: none;
        position: fixed;
        z-index: 9999;
        border-radius: 16px;
        overflow: hidden;
        pointer-events: none; /* Let clicks pass through when idle (handled internally via pointer-events: auto in button) */
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        
        /* Desktop Default */
        right: 20px;
        bottom: 20px;
        width: 320px;
        height: 160px;
    }
    
    /* Mobile Responsive */
    @media (max-width: 640px) {
        #${iframeId} {
            right: 3%;
            left: 3%;
            bottom: 16px;
            width: 94%; /* Full width minus margins */
            height: 120px; /* More compact on mobile */
            border-radius: 20px;
        }
    }
  `;
  document.head.appendChild(style);
  
  // Allow pointer events on the iframe itself so interactivity works
  iframe.style.pointerEvents = 'auto'; 

  // 1. Configuration (Obfuscated)
  var encodedConfig = 'eyJzeXN0ZW1JbnN0cnVjdGlvbiI6IkVyZXMgdW4gYXNpc3RlbnRlIHZpcnR1YWwgcXVlIGVzdGEgZW4gbGEgcGFnaW5hIGRlIHN1b2JhcmVmb290LmVzIHkgcHVlZGVzIHJlc3BvbmRlciBhIGN1bGFxdWllciBwcmVndW50YSBzb2JyZSBjb25zZWpvcyBkZSBjYWx6YWRvIGJhcmVmb290LiBBZGVtw6FzIHB1ZWRlcyBtb3ZlciBsYSBwYWdpbmEgeSB2ZXIgc3UgY29udGVuaWRvIHBhcmEgZXhwbGljYXIgYSBsb3MgdXN1YXJpb3MgbG8gcXVlIHB1ZWRlbiBlbmNvbnRyYXIgZGVudHJvIGRlIGxhIHBhZ2luYSB3ZWIiLCJ2b2ljZSI6IkNoYXJvbiJ9';

  // 2. Helper to extract page context (Reading the website)
  function getPageContent() {
    // Simple scraper: gets visible text from body, cleans up whitespace, limits length
    var text = document.body.innerText || "";
    return text.replace(/\s+/g, ' ').substring(0, 15000); // Limit to ~15k chars for context window
  }

  // 3. Initialize Iframe
  iframe.onload = function() {
    if (iframe.contentWindow) {
      var sendConfig = function() {
        try {
            var decodedJson = decodeURIComponent(escape(atob(encodedConfig)));
            var config = JSON.parse(decodedJson);
            
            // Inject current page content into config
            config.pageContent = getPageContent();
            
            iframe.contentWindow.postMessage(config, '*');
        } catch (e) {
            console.error('Avatar: Failed to init configuration.', e);
        }
      };

      // Retry mechanism
      sendConfig();
      setTimeout(sendConfig, 500);
      setTimeout(sendConfig, 1500);
    }
  };

  // 4. Listen for Commands from the Avatar (Navigation/Scrolling/Cart)
  window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'AVATAR_ACTION') {
        const cmd = event.data.command;
        const args = event.data.args;

        if (cmd === 'scrollPage') {
            if (args.direction === 'up') window.scrollBy({ top: -500, behavior: 'smooth' });
            else if (args.direction === 'down') window.scrollBy({ top: 500, behavior: 'smooth' });
            else if (args.direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
            else if (args.direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        if (cmd === 'navigatePage') {
             if (args.url) window.location.href = args.url;
        }

        if (cmd === 'addToCart') {
            console.log("Avatar adding to cart:", args.productName);
            
            // A. Dispatch a standard event so developers can hook their own logic
            var customEvent = new CustomEvent('avatar-add-to-cart', { detail: args });
            window.dispatchEvent(customEvent);

            // B. Fallback: Try to find an "Add to Cart" button and click it (Heuristic)
            var buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));
            var targetBtn = buttons.find(b => {
                var t = b.innerText.toLowerCase();
                return (t.includes('add') || t.includes('cart') || t.includes('comprar') || t.includes('añadir')) && 
                       (t.includes(args.productName.toLowerCase()) || document.title.toLowerCase().includes(args.productName.toLowerCase()) || buttons.length < 5);
            });
            
            if (targetBtn) {
                targetBtn.click();
                var toast = document.createElement('div');
                toast.innerText = '🛒 Adding ' + args.productName + ' to cart...';
                toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#10b981; color:white; padding:10px 20px; border-radius:8px; z-index:10000; box-shadow:0 4px 6px rgba(0,0,0,0.1); font-family:sans-serif;';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        }
    }
  });

  document.body.appendChild(iframe);
})();
