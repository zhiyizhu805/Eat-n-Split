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
//imporvement1: pass the current object as a prop instead of one by one
//improvement2: should include components in App component instead of ListFriends component
//improvement3:generate unique id by using crypto.randomUUID()
//improvement4:generate random profile photo
//imporvement5: dynamic select/close button
//imporvement6: dynamic selected bg
//imporvement7: 😡 Cannot read properties of null.Because I set the default state value
//              to null.so when friend.id  is  null.id is NOT gonna work.SO we need to
//              use option chainning here
//imporvement8: you dont need two states isOpen and selectFriend at the same time!
//              can declare isOpen as a derived variable - as it can be calculated
//              based on selectFriend variable
//imporvement9: set a limit to the yourexpense field,dont let it exceeds the bill value
//😖imporvement10:does not really rerender..when switch view ,the old content remain there

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  //❌ const [isOpen, setOpen] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);
  const [isOpenAdd, setOpenAdd] = useState(false);
  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setOpenAdd(false);
  }
  function handleSelection(friend) {
    setSelectFriend(
      (cur) => (cur?.id === friend?.id ? null : friend)
      // friends?.find((friend) => friend?.id === curSelectFriend.id)
    );
    // setOpen((isOpen) => (selectFriend?.id === id ? !isOpen : true));
    setOpenAdd(false);

    // setOpen((isOpen) => !isOpen);
  }
  // function handleNewBalance(newBalence) {
  //   setFriends(
  //     friends.map((friend) =>
  //       friend.id === selectFriend.id
  //         ? { ...friend, balance: newBalence }
  //         : friend
  //     )
  //   );
  // }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  // function handleSplitBill(value) {
  //   console.log(value);
  // }
  return (
    <div className="app">
      <div className="sidebar">
        <ListFriends
          friends={friends}
          // onOpen={handleOpen}
          onSelection={handleSelection}
          selectFriend={selectFriend}
          // isOpen={isOpen}
        />
        {isOpenAdd && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={() => setOpenAdd((isOpenAdd) => !isOpenAdd)}>
          {isOpenAdd ? "Close" : "Add a friend"}
        </Button>
      </div>
      {/* <Button onClick={() => setOpenAdd(!isOpenAdd)}>Add friend</Button> */}
      {selectFriend && (
        <SplitBillForm
          selectFriend={selectFriend}
          // onNewBalance={handleNewBalance}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function ListFriends({ friends, onSelection, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectFriend={selectFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectFriend }) {
  const isOpen = selectFriend?.id === friend.id ? true : false;
  return (
    <li className={isOpen ? "selected" : ""}>
      <h3>{friend.name}</h3>
      <img src={friend.image} alt="friendImg" />

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}💰
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}💰
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      {/* <button className="button" onClick={() => onOpen(friend.id)}>
        Select
      </button> */}
      <Button onClick={() => onSelection(friend)}>
        {isOpen ? "Close" : "Select"}
      </Button>
    </li>
  );
}

//use controlled elements
function AddFriendForm({ onAddFriend }) {
  const [newName, setNewName] = useState("");
  const [newImg, setNewImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName) return;
    console.log("img", newImg, !newImg);
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: newName,
      // image: `${newImg ? newImg : "/profile.jpg"}`,
      image: `${newImg}?=${id}`,
      balance: 0,
    };
    console.log("new", newFriend);
    setNewName("");
    setNewImg("https://i.pravatar.cc/48");
    onAddFriend(newFriend);
  }
  // function handleNewName(newName) {
  //   setNewName(newName);
  // }
  // function handleNewImg(newImg) {
  //   setNewImg(newImg);
  // }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputBox
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      >
        👭 Friend name
      </InputBox>
      <InputBox
        type="text"
        value={newImg}
        onChange={(e) => setNewImg(e.target.value)}
      >
        🌄 Image URL
      </InputBox>
      {/* <button className="button">Add</button> */}
      <Button>Add</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function InputBox({ type, value, onChange, children }) {
  return (
    <>
      <label>{children}</label>
      <input
        type={type}
        value={value}
        disabled={`${!onChange ? "disabled" : ""}`}
        // onChange={(e) => {
        //   onNew(e.target.value);
        // }}
        onChange={onChange}
      />
    </>
  );
}

function SplitBillForm({ selectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoPaid, setWho] = useState("you");
  const paidByFriend = bill ? bill - yourExpense : "";
  // const newBalence =
  //   whoPaid === "you"
  //     ? Number(selectFriend.balance + paidByFriend)
  //     : Number(selectFriend.balance - yourExpense);
  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoPaid === "you" ? paidByFriend : -yourExpense);
    // if (!bill) return;
    // if (!yourExpense) return;
    if (!bill || !yourExpense) return;
    // onSplitBill(newBalence);
    setBill("");
    setYourExpense("");
    setWho("you");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <InputBox
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      >
        💰 Bill value
      </InputBox>
      <InputBox
        type="number"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
      >
        🧍‍♀️ Your expense
      </InputBox>
      <InputBox type="number" value={paidByFriend}>
        👭 {selectFriend.name}'s expense
      </InputBox>
      <label>🤑 Who is paying the bill?</label>
      <select value={whoPaid} onChange={(e) => setWho(e.target.value)}>
        <option value="you">You</option>
        <option value="notYou">{selectFriend.name}</option>
      </select>
      {/* <button className="button">Split bill</button> */}
      <Button>Split bill</Button>
    </form>
  );
}
