const Card = ({ user }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={user.avatar}
        alt={user.username}
        className="w-20 h-20 rounded-full mx-auto"
      />

      <h2 className="text-xl font-bold text-center mt-2">{user.fullName}</h2>

      <p className="text-center text-gray-500">@{user.username}</p>

      <p className="text-center">{user.email}</p>
      <p className="text-center">{user.country}</p>
    </div>
  );
};

export default Card;
