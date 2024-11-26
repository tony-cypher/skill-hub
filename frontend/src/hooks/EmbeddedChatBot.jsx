import React, { useEffect } from "react";

const EmbeddedChatbot = () => {
  useEffect(() => {
    // Step 1: Add the configuration script
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "n_vn3_CRg1DmHWAPsLIJz",
        domain: "www.chatbase.co"
      };
    `;
    document.body.appendChild(configScript);

    // Step 2: Add the external chatbot script
    const chatbotScript = document.createElement("script");
    chatbotScript.src = "https://www.chatbase.co/embed.min.js";
    chatbotScript.setAttribute("chatbotId", "n_vn3_CRg1DmHWAPsLIJz");
    chatbotScript.setAttribute("domain", "www.chatbase.co");
    chatbotScript.defer = true;
    document.body.appendChild(chatbotScript);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(configScript);
      document.body.removeChild(chatbotScript);
    };
  }, []);

  return (
    <div>
      <h1>Chatbot Embedded</h1>
    </div>
  );
};

export default EmbeddedChatbot;
