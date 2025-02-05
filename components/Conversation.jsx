const conversations = [
  { id: 1, name: "Jane Doe", lastMessage: "Hi" },
  { id: 2, name: "Test Group", lastMessage: "James Smith: Hi" },
];

const Conversations = ({ onSelect }) => {
  return (
    <div className="w-72 h-screen bg-white border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">Conversations</h2>
      <div className="flex flex-col">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            className="p-4 text-left hover:bg-gray-100 border-b"
            onClick={() => onSelect(chat.id)}
          >
            <div className="font-medium">{chat.name}</div>
            <div className="text-sm text-gray-500">{chat.lastMessage}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
