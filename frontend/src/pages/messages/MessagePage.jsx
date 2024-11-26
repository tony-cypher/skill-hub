const MessagePage = () => {
  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 max-h-screen bg-base-300">
        {/* <div className="flex justify-between items-center p-4 border-b border-gray-700"></div> */}

        <div className="text-center p-4 font-bold">Chat</div>

        <div className="m-6">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pinimg.com/736x/ba/22/ec/ba22ec0b3b96700849534e692a2d50c1.jpg" />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">Hi, What service do you need ?</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg" />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble">
              The conduit wiring in my house got burnt. <br /> I need a new
              wiring.
            </div>
          </div>
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pinimg.com/736x/ba/22/ec/ba22ec0b3b96700849534e692a2d50c1.jpg" />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">12:48</time>
            </div>
            <div className="chat-bubble">
              That's what we do. <br />
              Where do you live ?
            </div>
          </div>
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg" />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">12:50</time>
            </div>
            <div className="chat-bubble">Uruagu Nnewi, Anambra State.</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Message"
          className="input input-bordered w-4/5 m-5 mt-auto"
        />
      </div>
    </>
  );
};
export default MessagePage;
