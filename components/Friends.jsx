const friends = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
];

const Friends = () => {
  return (
    <div className="w-72 h-screen bg-white border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">Friends</h2>
      <div className="flex flex-col">
        {friends.map((friend) => (
          <button
            key={friend.id}
            className="p-4 text-left hover:bg-gray-100 border-b"
          >
            <div className="font-medium">{friend.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Friends;
