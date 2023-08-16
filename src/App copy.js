import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  return (
    <div className="app">
      <ListFriends data={initialFriends} />
    </div>
  );
}

function ListFriends({ data }) {
  const [friends, setFriends] = useState(data);
  const [isOpen, setOpen] = useState(false);
  const [selectFriend, setSelectFriend] = useState("");
  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
  }
  function handleOpen(id) {
    setSelectFriend(friends.find((friend) => friend.id === id));
    setOpen((isOpen) => (selectFriend.id === id ? !isOpen : true));
    // setOpen((isOpen) => !isOpen);
  }
  function handleNewBalance(newBalence) {
    setFriends(
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: newBalence }
          : friend
      )
    );
  }
  return (
    <>
      <div className="sidebar">
        <ul>
          {friends.map((friend) => (
            <Friend
              name={friend.name}
              img={friend.image}
              balance={friend.balance}
              id={friend.id}
              onOpen={handleOpen}
            />
          ))}
          <AddFriendForm onAddFriend={handleAddFriend} />
        </ul>
      </div>
      {isOpen && (
        <SplitBillForm
          selectFriend={selectFriend}
          onNewBalance={handleNewBalance}
        />
      )}
    </>
  );
}

function Friend({ name, img, balance, id, onOpen }) {
  return (
    <li>
      <h3>{name}</h3>
      <img src={img} alt="friendImg" />

      {balance > 0 && (
        <p className="green">
          {name} owes you {balance}💰
        </p>
      )}
      {balance < 0 && (
        <p className="red">
          You owe {name} {balance}💰
        </p>
      )}
      {balance === 0 && <p>You and {name} are even</p>}

      <button className="button" onClick={() => onOpen(id)}>
        Select
      </button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [newName, setNewName] = useState("");
  const [newImg, setNewImg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName) return;
    console.log("img", newImg, !newImg);
    // if (!newImg)
    //   setNewImg("https://dribbble.com/shots/
    //              3418812-Default-Profile-Pic");
    // console.log(newImg);
    const newFriend = {
      id: newName,
      name: newName,
      image: `${newImg ? newImg : "/profile.jpg"}`,
      balance: 0,
    };
    console.log("new", newFriend);
    setNewName("");
    setNewImg("");
    onAddFriend(newFriend);
  }
  function handleNewName(newName) {
    setNewName(newName);
  }
  function handleNewImg(newImg) {
    setNewImg(newImg);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputBox type="text" value={newName} onNew={handleNewName}>
        👭 Friend name
      </InputBox>
      <InputBox type="text" value={newImg} onNew={handleNewImg}>
        🌄 Image URL
      </InputBox>
      <button className="button">Add</button>
    </form>
  );
}

function InputBox({ type, value, onNew, children }) {
  return (
    <>
      <label>{children}</label>
      <input
        type={type}
        value={value}
        disabled={`${!onNew ? "disabled" : ""}`}
        onChange={(e) => {
          onNew(e.target.value);
        }}
      />
    </>
  );
}

function SplitBillForm({ selectFriend, onNewBalance }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoPaid, setWho] = useState("you");
  const remain = Number(bill) - Number(yourExpense);
  const newBalence =
    whoPaid === "you"
      ? Number(selectFriend.balance + remain)
      : Number(selectFriend.balance - yourExpense);
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill) return;
    if (!yourExpense) return;
    onNewBalance(newBalence);
    setBill("");
    setYourExpense("");
    setWho("you");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <InputBox type="number" value={bill} onNew={setBill}>
        💰 Bill value
      </InputBox>
      <InputBox type="number" value={yourExpense} onNew={setYourExpense}>
        🧍‍♀️ Your expense
      </InputBox>
      <InputBox type="number" value={remain}>
        👭 {selectFriend.name}'s expense
      </InputBox>
      <label>🤑 Who is paying the bill?</label>
      <select value={whoPaid} onChange={(e) => setWho(e.target.value)}>
        <option value="you">You</option>
        <option value="notYou">{selectFriend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}
