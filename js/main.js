// 各ページを名前空間に管理
const config = {
  initialPage: document.getElementById("initialPage"),
  mainPage: document.getElementById("mainPage"),
  rankingPage: document.getElementById("rankingPage")
};

// ユーザー情報
class User {
  // 初期値（name, age, days, money, items）
  // name;age;days;money;clickCount;incomePerClick;incomePerSec;stock;items
  constructor(name, age, days, money, items) {
    this.name = name;
    this.age = age;
    this.days = days;
    this.money = money;
    this.clickCount = 0;// クリック数
    this.incomePerClick = 25; // 1クリックあたりの利益
    this.incomePerSec = 0;// 1秒あたりの利益
    this.stock = 0;// ETFの購入数
    this.items = items;
  }
};

// アイテム情報
class Items {
  // 初期値（name, type, currentAmount, maxAmount, perMoney, perRate, price, url）
  // name;type;currentAmount;maxAmount;perMoney;perRate;price;url;
  constructor(name, type, currentAmount, maxAmount, perMoney, perRate, price, url) {
    this.name = name;
    this.type = type;
    this.currentAmount = currentAmount;
    this.maxAmount = maxAmount;
    this.perMoney = perMoney;
    this.perRate = perRate;
    this.price = price;
    this.url = url;
  }
};

// レンダリング用
class View {
  // ログインページ
  static createInitialPage() {
    const container = document.createElement("div");
    container.classList.add("vh-100", "d-flex", "justify-content-center", "align-items-center")
    container.innerHTML = `
      <div class="bg-white text-center p-4">
        <h2 class="pb-3">Clicker Empire Game</h2>
        <form>
          <div class="form-row pb-3 row">
            <div class="col">
              <input type="text" class="form-control" placeholder="Your name" value="name">
            </div>
          </div>
        </form>
        <div class="row justify-content-between pb-3">
          <div class="col-6">
            <button type="submit" class="btn btn-primary col-12" id="newGame">New</button>
          </div>
          <div class="col-6">
            <button type="submit" class="btn btn-primary col-12" id="login">Login</button>
          </div>
        </div>
        <div class="row justify-content-between">
          <div class="col-12">
            <button type="submit" class="btn btn-danger col-12" id="rankingList">Ranking</button>
          </div>
        </div>
      </div>`;
    config.initialPage.append(container);
  }

  // メインページ
  static createMainPage(user) {
    // 雛形を作成
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="d-flex justify-content-center p-md-5 pb-5" style='height:100vh;'>
        <div class="bg-navy p-2 d-flex col-md-11 col-lg-10">
          <div class="bg-dark p-2 col-4" id="burgerStatus">
          </div>
          <div class="col-8">
            <div class="p-1 bg-navy" id="userInfo">
            </div>
            <div class="bg-dark mt-2 p-1 overflow-auto flowHeight" id="displayItems">
            </div>
            <div class="d-flex justify-content-end mt-2">
              <div class="border p-2 mr-2 hover" id="reset">
                <i class="fas fa-undo fa-2x text-white"></i>
              </div>
              <div class="border p-2 hover" id="save">
                <i class="fas fa-save fa-2x text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    config.mainPage.append(container);

    // ハンバーガーの状態・ユーザー情報・アイテム情報を各divにアセンブル
    document.getElementById("burgerStatus").append(View.createBurgerStatus(user));
    document.getElementById("userInfo").append(View.createUserInfo(user));
    document.getElementById("displayItems").append(View.createItemPage(user));
    // リセットボタンのクリックイベント
    const resetBtn = document.querySelector("#reset");
    resetBtn.addEventListener("click", () => {
      const res = confirm("状態をリセットしますか？");
      if (res) {
        config.mainPage.innerHTML = "";
        const resetUser = Controller.createInitialUserAccount(user.name);
        Controller.stopTimer(resetUser);
        View.createMainPage(resetUser);
        Controller.startTimer(resetUser);
      }
    });

    // 保存ボタンのクリックイベント
    const saveBtn = document.querySelector("#save");
    saveBtn.addEventListener("click", () => {
      // ユーザー情報を保存
      Controller.saveUserDate(user);
      // タイマーを止める
      Controller.stopTimer(user);
      // 初期ページに遷移
      Controller.initializePage();
    });
  }

  static createBurgerStatus(user) {
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-navy text-white text-center">
        <h5>${user.clickCount} Burgers</h5>
        <p>one click ￥${user.incomePerClick.toLocaleString()} </p>
      </div>
      <div class="p-2 pt-5 d-flex justify-content-center">
        <img src="./img/burger-307648_960_720.png" width="80%" class="py-2 hover img-fuid" id="burger">
      </div>
    `
    container.querySelector("#burger").addEventListener("click", () => {
      Controller.updateBurgerClick(user);

      View.updateBurgerStatus(user);

      View.createBurgerStatus(user);
      View.updateUserInfo(user);
    });
    return container;
  }

  static updateBurgerStatus(user) {
    const burgerStatus = document.getElementById("burgerStatus");
    burgerStatus.querySelector("h5").innerHTML = `${user.clickCount} Burgers`;
    burgerStatus.querySelector("p").innerHTML = `one click ￥${user.incomePerClick.toLocaleString()}`;
  }

  static createUserInfo(user) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-wrap", "p-1")
    container.innerHTML = `
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.name}</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.age} years old</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.days} days</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>￥${user.money.toLocaleString()}</p>
      </div>
    `;
    return container;
  }

  static updateUserInfo(user) {
    const userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = "";
    userInfo.append(View.createUserInfo(user));
  }

  static createItemPage(user) {
    const container = document.createElement("div");
    for (let i = 0; i < user.items.length; i++) {

      let increaseRate = Controller.discriminateType(user.items[i]);

      container.innerHTML += `
        <div class="text-white d-sm-flex align-items-center m-1 selectItem">
          <div class="d-none d-sm-block p-1 col-sm-3">
            <img src="${user.items[i].url}" class="img-fluid">
          </div>
          <div class="col-sm-9">
            <div class="d-flex justify-content-between">
              <h4>${user.items[i].name}</h4>
              <h4>${user.items[i].currentAmount}</h4>
            </div>
            <div class="d-flex justify-content-between">
              <p>￥${user.items[i].price.toLocaleString()}</p>
              <p class="text-success">￥${increaseRate}</p>
            </div>
          </div>
        </div>`;
    }

    let select = container.querySelectorAll(".selectItem");
    for (let i = 0; i < select.length; i++) {
      select[i].addEventListener("click", () => {
        container.innerHTML = "";
        container.append(View.itemInfoPage(user, i));
      });
    }
    return container;
  }

  static itemInfoPage(user, index) {
    const container = document.createElement("div");
    container.classList.add("bg-navy", "p-2", "m-1", "text-white");
    const item = user.items[index];
    const increaseRate = Controller.discriminateType(item);
    const max = 0 < item.maxAmount ? item.maxAmount : "∞";
    container.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4>${item.name}</h4>
          <p>Max purchases: ${max}</p>
          <p>Price: ￥${item.price.toLocaleString()}</p>
          <p>Get ￥${increaseRate}</p>
        </div>
        <div class="p-2 d-sm-block col-sm-5">
          <img src="./img/${item.url}" class="img-fluid">
        </div>
      </div>
      <p>How many would you like to buy?</p>
      <input type="number" placeholder="0" class="col-12 form-control" min="0" max="${max}" value="0">
      <p class="text-right" id="totalPrice">total: ￥0</p>
      <div class="d-flex justify-content-between pb-3">
        <button class="btn btn-outline-primary col-5 bg-light" id="back">Go Back
        </button><button class="btn btn-primary col-5" id="purchase">Purchase</button>
      </div>`

    container.querySelector("input").addEventListener("change", (e) => {
      const target = e.currentTarget;
      Controller.calcTotalPrice(item, target.value);
    });

    container.querySelector("#back").addEventListener("click", () => {
      const displayItems = document.getElementById("displayItems");
      displayItems.innerHTML = "";
      displayItems.append(View.createItemPage(user));
    });

    container.querySelector("#purchase").addEventListener("click", () => {
      const count = container.querySelector("input").value;
      if (count == 0) alert("購入する数を入力してください。");
      else if (max - item.currentAmount < count) alert("これ以上購入できません");
      else {
        Controller.itemPurchase(user, index, count);
        alert("購入が完了しました。");
        View.updateBurgerStatus(user);
        View.updateUserInfo(user);
        displayItems.innerHTML = "";
        displayItems.append(View.createItemPage(user));
      }
    });

    return container;
  }

  static createRankingPage(sortedAllUser) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center", "p-md-5", "pb-5");
    container.style.height = "100vh";
    let html = `
      <div class="bg-navy p-2 d-flex col-md-11 col-lg-10">
        <div class="col-12">
          <div class="text-white d-flex text-center">
            <h3 class="col-1 py-3 mb-0"></h3>
            <h3 class="col-5 py-3 mb-0">UserName</h3>
            <h3 class="col-6 py-3 mb-0">総資産</h3>
          </div>
          <div class="bg-dark mt-2 p-1 overflow-auto h-75" id="rankingLIst">`
      if(sortedAllUser.length == 0) html += `<div class="text-white text-center h1 rankingItem">No Data</div>`;
      else {
        for (let i = 0; i < sortedAllUser.length; i++) {
          html += `
            <div class="text-white border-bottom border-light row align-items-center m-1 text-center rankingItem">
              <p class="col-1 py-3 mb-0">${i + 1}</p>
              <h4 class="col-5 py-3 mb-0">${sortedAllUser[i].name}</h4>
              <p class="col-6 py-3 mb-0">${sortedAllUser[i].money}</p>
            </div>`
        }
      }
    html += `
          </div>
          <div class="row justify-content-center py-3">
            <div class="col-6">
              <button type="submit" class="btn btn-light col-12" id="back">Go Back</button>
            </div>
          </div>
        </div>
      </div>`
    
    container.innerHTML = html;
    config.rankingPage.append(container);

    container.querySelector("#back").addEventListener("click", () => {
      config.rankingPage.innerHTML = "";
      config.initialPage.classList.remove("d-none");
    });
  }
};

// 入力→操作
class Controller {
  setTimerID;

  static startGame() {

    // 初期ページ設定
    View.createInitialPage();

    const newGameBtn = document.getElementById("newGame");
    newGameBtn.addEventListener("click", () => {
      const userName = config.initialPage.querySelector("input").value;
      if (userName == "") alert("新しい名前を入力してください。");
      else if (Controller.getUserData(userName) != null) alert("ユーザーがすでに存在しています。ログインしてください。");
      else {
        // Userオブジェクトを生成してMainへ遷移
        const user = Controller.createInitialUserAccount(userName);
        Controller.moveInitialToMain(user);
      };
    });
    const loginBtn = document.getElementById("login");
    loginBtn.addEventListener("click", () => {
      const userName = config.initialPage.querySelector("input").value;
      if (userName == "") alert("名前を入力してください。");
      else if (Controller.getUserData(userName) == null) alert("ユーザーが存在しません。別の名前を入力してください。");
      else {
        const user = Controller.callUserAccount(userName);
        Controller.moveInitialToMain(user);
      };
    });
    const rankingList = document.getElementById("rankingList");
    rankingList.addEventListener("click", () => {
      Controller.moveToRankingPage();
    });

  }
  // Mainを表示
  static moveInitialToMain(user) {
    config.initialPage.classList.add("d-none");
    View.createMainPage(user);
    Controller.startTimer(user);
  };
  // ランキングを表示
  static moveToRankingPage() {
    config.initialPage.classList.add("d-none");
    const allUser = Controller.getAllUserData();
    const sortedAllUser = Controller.sortUser(allUser);
    View.createRankingPage(sortedAllUser);
  }
  // 最初の画面に戻る
  static initializePage() {
    config.initialPage.classList.remove("d-none");
    config.initialPage.innerHTML = "";
    config.mainPage.innerHTML = "";
    config.rankingPage.innerHTML = "";
    Controller.startGame();
  }

  static startTimer(user) {
    Controller.setTimerID = setInterval(() => {
      user.days += 15;
      user.money += user.incomePerSec;
      if (user.days % 360 == 0) user.age++;
      View.updateUserInfo(user);
    }, 1000)
  }
  static stopTimer() {
    clearInterval(Controller.setTimerID);
  }

  static createInitialUserAccount(userName) {
    let itemsList = [
      new Items("Flip machine", "ability", 0, 500, 25, 0, 15000, "./img/grill-4308709_960_720.png"),
      new Items("ETF Stock", "investment", 0, -1, 0, 0.001, 300000, "./img/chart-1296049_960_720.png"),
      new Items("ETF Bonds", "investment", 0, -1, 0, 0.0007, 300000, "./img/chart-1296049_960_720.png"),
      new Items("Lemonade Stand", "realState", 0, 1000, 30, 0, 30000, "./img/juice-35236_960_720.png"),
      new Items("Ice Cream Truck", "realState", 0, 500, 120, 0, 100000, "./img/ice-cream-4805333_960_720.png"),
      new Items("House", "realState", 0, 100, 32000, 0, 20000000, "./img/home-1294564_960_720.png"),
      new Items("TownHouse", "realState", 0, 100, 64000, 0, 40000000, "./img/modern-house-4276598_960_720.png"),
      new Items("Mansion", "realState", 0, 20, 500000, 0, 250000000, "./img/condominium-2903520_960_720.png"),
      new Items("Industrial Space", "realState", 0, 10, 2200000, 0, 1000000000, "./img/factory-48781_960_720.png"),
      new Items("Hotel Skyscraper", "realState", 0, 5, 25000000, 0, 10000000000, "./img/skyscrapers-48853_960_720.png"),
      new Items("Bullet-Speed Sky Railway", "realState", 0, 1, 30000000000, 0, 10000000000000, "./img/train-157027_960_720.png")
    ]
    return new User(userName, 20, 0, 5000000000, itemsList);
  }

  static updateBurgerClick(user) {
    user.clickCount++;
    user.money += user.incomePerClick;
  }

  static calcTotalPrice(item, count) {
    const totalPrice = document.getElementById("totalPrice");
    if (item.name == "ETF Stock") {
      totalPrice.innerHTML = "total: ￥" + Math.round(item.price * 10 * (Math.pow(1.1, count) - 1));
      item.price = Math.round(item.price * Math.pow(1.1, count));
    } else {
      totalPrice.innerHTML = "total: ￥" + item.price * count;
    }
  }

  static discriminateType(item) {
    let type;
    if (item.type == "ability") type = item.perMoney + " /click";
    else if (item.type == "investment") type = item.perRate + "% /day";
    else type = item.perMoney + " /day";

    return type;
  }

  static itemPurchase(user, index, count) {
    count = parseInt(count)
    const item = user.items[index];
    item.currentAmount += count;
    user.money -= item.price * count;

    if (item.type == "ability") user.incomePerClick += count * item.perMoney;
    else if (item.type == "realState") user.incomePerSec += count * item.perMoney * 15;
    else if (item.type == "investment") {
      user.stock += item.price * count;
      user.incomePerSec += user.stock * count * item.perRate * 15;
    }
  }

  static callUserAccount(userName) {
    const str = Controller.getUserData(userName);
    return JSON.parse(str);
  }


  // ローカルストレージ関連
  static saveUserDate(user) {
    localStorage.setItem("CMGname-" + user.name, JSON.stringify(user));
    alert("データを保存しました。終了します。");
  }

  static getUserData(userName) {
    return localStorage.getItem("CMGname-" + userName);
  }

  static getAllUserData() {
    const allUserKey = [];
    const allKeyArr = Object.keys(localStorage);
    for (let i = 0; i < allKeyArr.length; i++) {
      if (allKeyArr[i].slice(0, 8) == "CMGname-") allUserKey.push(allKeyArr[i]);
    }
    const allUser = [];
    for (let j = 0; j < allUserKey.length; j++) {
      let str = localStorage.getItem(allUserKey[j]);
      allUser.push(JSON.parse(str));
    }
    return allUser;
  }

  static sortUser(allUser) {
    const sortedAllUser = [...allUser];
    sortedAllUser.sort(function (a, b) { return b.money > a.money ? 1 : -1 });
    return sortedAllUser
  }

};

Controller.startGame();