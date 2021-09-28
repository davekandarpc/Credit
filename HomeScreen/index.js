import React, { Component } from "react";
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ProgressBarAndroid,
  ScrollView,
  Modal,
  RefreshControl,
  Platform,
} from "react-native";
import { styles } from "./styles";
import { HalfButton } from "../../components/HalfButton";
import Icon from "react-native-vector-icons/FontAwesome";
import Close from "react-native-vector-icons/AntDesign";
import Swipeout from "react-native-swipeout";
import AsyncStorage from "@react-native-community/async-storage";
import { openDatabase } from "react-native-sqlite-storage";
import { NavigationEvents } from "react-navigation";
import PlaidLink from "react-native-plaid-link-sdk";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { GetlistAccount } from "../../action";
import { AddInstituteAccount } from "../../action";
import { DeleteAccountToApi } from "../../action";
import { DeleteAllDatatoDeleteAccount } from "../../action";
import { setOneSignalToken } from "../../action";

// import { WebView } from 'react-native-webview';

const width = Dimensions.get("window").width;

var db = openDatabase({ name: "Credit.db", createFromLocation: 1 });



const baseUrl = "https://sandbox.plaid.com/";


export class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      switch1Value: false,
      ModalVisible: false,
      tmpArray_1: [],
      access_token: null,
      acc: [],
      activity_indicator: false,
      institute_Visible: false,
      institute_list: [],
      institute_selected_list: [],
      selectedIndex: [],
      tempidx: [],
      selids: [],
      currentID: null,
      oneIdSelected: null,
      navAccessToken: null,
      acc_id: null,
      card_No: null,
      /// DB
      client_id: "5e1f2ab221bd680011c48126",
      secret: "9ac4ed6b27962ed2f2c289f84c7ba4",
      pubilckey: "20758587172f3a5fe3f489862704b7",
      env: "https://sandbox.plaid.com/",
      institution_id: null,
      access_token: null,
      item_id: null,
      BankDb: null,
      // Credit Card
      CCaccount_id: null,
      CCname: null,
      CCmask: null,
      CCofficial_name: null,
      CClimit: null,
      CCbalances_current: null,
      CCDB: [],
      dataInsert: false,
      DBaccesstoken: null,
      ccdata: [],
      sb: true,
      InstituteDB: null,
      selectInstitute: [],
      selectInstituteName: [],
      DeleteInstitute_Id: null,
      DatafrmBank: [],
      Sel_Ind_ID: [],
      ModalVisible_Exists_Institution: false,
      DeleteInsName: [],
      singleInsName: null,
      selectInstituteSingle: null,
      newacc: [],
      deleterecord: [],
      userCountry: [],
      selectdeleteId: null,
      mas: null,
      rounup: null,
      User_Id: null,
      plaidsdk: false,
      bankID: null,
      PlaidClick: false,
      res_bank_id: null,
      res_public_token: null,
      res_bank_name: null,
      noBankFound: false,
      timetext: "Good Morning",
    };
  }
  
  componentWillReceiveProps = async (nextProps) => {
    console.log("Next Props Transection: " + nextProps.type);
    if (nextProps.type === "NO_INTERNET") {
      alert("NO Internet : ");
    }
    if (nextProps.type === "DELETE_ALL_DATA_TO_DELETEACCOUNT_PENDING") {
      this.setState({ activity_indicator: true }, () => {});
    } else if (nextProps.type === "DELETE_ALL_DATA_TO_DELETEACCOUNT_SUCCESS") {
      this.setState({ activity_indicator: false }, () => {
        var status = nextProps.delete_account_todelete_account.status;
        console.log("Status : " + status);
        console.log("Status : " + JSON.stringify(status));
        this.props.AddInstituteAccount(
          this.state.User_Id,
          this.state.res_public_token,
          this.state.res_bank_id,
          this.state.res_bank_name,
          status
        );
      });
    } else if (nextProps.type === "DELETE_ALL_DATA_TO_DELETEACCOUNT_FAIL") {
      this.setState({ activity_indicator: false });
    }

    if (nextProps.type === "ADDINSTITUTEACCOUNT_PENDING") {
      this.setState({ activity_indicator: true }, () => {
        console.log("User Id : " + JSON.stringify(this.state.Userid));
      });
    } else if (nextProps.type === "ADDINSTITUTEACCOUNT_SUCCESS") {
      console.log(
        "Next Props Transection: " +
          JSON.stringify(nextProps.add_institute_account)
      );
      var status = nextProps.add_institute_account.status;
      this.setState({ activity_indicator: false }, () => {
        // this.props.GetlistAccount(this.state.User_Id);
        if (status !== 400) {
          this.setState({ activity_indicator: false }, () => {
            // this.props.GetlistAccount(this.state.User_Id);
            this.reload();
            // this.props.navigation.navigate("LoginScreen")
          });
        }
      });
      //   this.setState({activity_indicator: false}, () => {
      //     // alert(nextProps.add_institute_account.message)
      //   });
      // }
    } else if (nextProps.type === "ADDINSTITUTEACCOUNT_FAIL") {
      this.setState({ activity_indicator: false });
    }
    if (nextProps.type === "GET_INSTITUTEACCOUNT_LIST_PENDING") {
      this.setState({ activity_indicator: true }, () => {
        console.log("User Id : " + JSON.stringify(this.state.Userid));
      });
    } else if (nextProps.type === "GET_INSTITUTEACCOUNT_LIST_SUCCESS") {
      // console.log('Next Props Transection: GET_INSTITUTEACCOUNT_LIST_SUCCESS' +JSON.stringify(nextProps.get_institute_account_list),);
      // console.log('Next Props Transection: GET_INSTITUTEACCOUNT_LIST_SUCCESS' +nextProps.get_institute_account_list.deletedaccount.length);
      var tmpaccount = nextProps.get_institute_account_list;
      console.log("get_institute_account_list : " + JSON.stringify(tmpaccount));
      // console.log(
      //   'get_institute_account_list __ accountdata.length__ : ' +
      //     JSON.stringify(tmpaccount.accountdata.length),
      // );
      this.setState({ activity_indicator: false }, () => {
        console.log("Array tmpaccount " + tmpaccount.length);
        if (nextProps.get_institute_account_list.status !== 100) {
          if (
            0 === nextProps.get_institute_account_list.deletedaccount.length
          ) {
            console.log("delete data no");
            if (tmpaccount.accountdata.length > 0) {
              this.setDataToDB(tmpaccount);
            } else {
              this.setState({ noBankFound: true });
            }
          } else {
            console.log("delete data yes");
            // this.setState({ activity_indicator: false }, () => {
            this.deleteRecord(tmpaccount);
            // })
          }
        } else {
          this.setState({ noBankFound: true });
        }
      });
    } else if (nextProps.type === "GET_INSTITUTEACCOUNT_LIST_FAIL") {
      this.setState({ activity_indicator: false });
    }
    if (nextProps.type === "DELETE_ACCOUNT_PENDING") {
      this.setState({ activity_indicator: true }, () => {
        console.log("User Id : " + JSON.stringify(this.state.Userid));
      });
    } else if (nextProps.type === "DELETE_ACCOUNT_SUCCESS") {
      var deleteBank_Account = nextProps.delete_account;
      console.log(
        "Delete Bank Account : " + JSON.stringify(deleteBank_Account)
      );

      this.setState({ activity_indicator: false }, () => {
        // this.props.GetlistAccount(this.state.User_Id);
        this.reload();
      });
    } else if (nextProps.type === "DELETE_ACCOUNT_FAIL") {
      this.setState({ activity_indicator: false });
    }
  };

  CheckIdExists = () => {
    const { selectInstitute } = this.state;
    var DatafrmBank = selectInstitute;
    var ExitsID = [];
    var Sel_Ind_ID = this.state.Sel_Ind_ID;
    var DelInsName = [];
    console.log("Institute From Bank ");

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Bank", [], (tx, results) => {
        //console.log("CHECK GetAllDatafromDB : " + JSON.stringify(results.rows.length))
        for (let i = 0; i < results.rows.length; i++) {
          console.log(
            "CHECK GetAllDatafromDB" +
              JSON.stringify(results.rows.item(i).institution_id)
          );
          //this.setState({DatafrmBank:DatafrmBank})
        }
        for (let i = 0; i < selectInstitute.length; i++) {
          Sel_Ind_ID.push(selectInstitute[i].institution_id);
          console.log("Institute From Bank " + this.state.Sel_Ind_ID);
          this.setState({ Sel_Ind_ID: Sel_Ind_ID });

          //console.log("Institute From User " + selectInstitute[i].institution_id)
          for (let j = 0; j < results.rows.length; j++) {
            if (
              selectInstitute[i].institution_id ===
              results.rows.item(j).institution_id
            ) {
              console.log(
                "Institute From Bank IFFF " + selectInstitute[i].institution_id
              );
              console.log(
                "Institute From Bank IFFF " +
                  JSON.stringify(selectInstitute[i].name)
              );
              ExitsID.push(selectInstitute[i].institution_id);
              if (j + 1 === results.rows.length) {
                console.log("IFFFFF ====== ");
                DelInsName.push(JSON.stringify(selectInstitute[i].name), ".");
              } else {
                console.log("IFFFFF Else =======");
                DelInsName.push(JSON.stringify(selectInstitute[i].name), ",");
              }
              //break
            }
            // else {
            //     console.log("Institute From Bank ELSE " + selectInstitute[i].institution_id)
            //     //DatafrmBank.push(selectInstitute[i].institution_id)
            //     // break

            // }
          }
        }
        if (DelInsName.length > 0) {
          this.setState(
            {
              DeleteInsName: DelInsName,
              ModalVisible_Exists_Institution: true,
            },
            () => {
              console.log("EXITS INS NAME : " + this.state.DeleteInsName);
            }
          );
        }
        this.setSelctedId(ExitsID);
        //this.setSelctedId(ExitsID)
        // this.setState({ selectInstitute: DatafrmBank }, () => {
        //     this.GetapiCreate();
        //     console.log("Institute From Bank ")
        // })
      });
    });
  };

  setSelctedId = (ExitsID) => {
    console.log("Exits ID : " + ExitsID);
    console.log("Exits ID : " + JSON.stringify(this.state.Sel_Ind_ID));
    console.log("Exits ID : " + this.state.Sel_Ind_ID.length);
    //var ext = JSON.parse(ExitsID)
    var Arr = this.state.Sel_Ind_ID;
    for (let l = 0; l < Arr.length; l++) {
      ////console.log("SEL ID ARR FOR: "+Arr[l])
      console.log("SEL ID ARR : " + Arr[l]);
      for (let k = 0; k < ExitsID.length; k++) {
        console.log("SEL ID ARR EXITS: " + ExitsID[k]);
        if (Arr[l] === ExitsID[k]) {
          console.log("SEL ID ARR IFF: " + Arr[l]);
          Arr.splice(l, 1);
          //break;
        }
      }
    }
    console.log("SEL ID ARR RESULTS : " + Arr);
    this.setState({ Sel_Ind_ID: Arr }, () => {
      console.log("SEL ID STATE VARIABLE  :  =====" + this.state.Sel_Ind_ID);
      this.GetapiCreate();
    });
  };

  DeleteRecord = () => {
    const { DeleteInstitute_Id } = this.state;
    //var DeleteBank = "DELETE FROM Bank WHERE institution_id = ?";
    var DeleteBank = "DELETE FROM Bank WHERE institution_id = ?";
    var DeleteCreditCard = "DELETE FROM Credit_Cards WHERE institution_id = ?";
    db.transaction((tx) => {
      tx.executeSql(DeleteBank, [DeleteInstitute_Id], (tx, results) => {
        console.log("DELETE BANK DATA : ");
        console.log("DELETE BANK DATA : " + JSON.stringify(results));
        console.log("DELETE BANK DATA : " + results.rows.length);
      });
    });
    db.transaction((txn) => {
      txn.executeSql(DeleteCreditCard, [DeleteInstitute_Id], (txn, results) => {
        console.log("DELETE CREDITCARD DATA : ");
        console.log("DELETE CREDITCARD DATA : " + JSON.stringify(results));
        console.log("DELETE CREDITCARD DATA : " + results.rows.length);
      });
    });
    this.GetAllDatafromDB();
  };

  DeleteRecordNew = () => {
    const { DeleteInstitute_Id } = this.state;
    //var DeleteBank = "DELETE FROM Bank WHERE institution_id = ?";
    //var DeleteBank = "DELETE FROM Bank WHERE account_id = ?";
    var DeleteCreditCard = "DELETE FROM Credit_Cards WHERE account_id = ?";
    // db.transaction((tx) => {
    //     tx.executeSql(DeleteBank, [DeleteInstitute_Id], (tx, results) => {
    //         console.log("DELETE BANK DATA : ")
    //         console.log("DELETE BANK DATA : " + JSON.stringify(results))
    //         console.log("DELETE BANK DATA : " + results.rows.length)
    //     })
    // })
    db.transaction((txn) => {
      txn.executeSql(DeleteCreditCard, [DeleteInstitute_Id], (txn, results) => {
        console.log("DELETE CREDITCARD DATA : ");
        console.log("DELETE CREDITCARD DATA : " + JSON.stringify(results));
        console.log("DELETE CREDITCARD DATA : " + results.rows.length);
      });
    });
    this.GetAllDatafromDB();
  };

  StoreDB = (
    insID,
    insName,
    account_id,
    name,
    mask,
    official_name,
    limit,
    current
  ) => {
    const {
      count,
      client_id,
      secret,
      pubilckey,
      env,
      institution_id,
      access_token,
      item_id,
      CCaccount_id,
      CCname,
      CCmask,
      CCofficial_name,
      CClimit,
      CCbalances_current,
      dataInsert,
    } = this.state;
    //var CreditCard = "INSERT INTO Credit_Cards (institution_id,account_id,name,mask,official_name,account_limit,balances_current) VALUES ('insID', 'CCaccount_id', 'CCname', 'CCmask', 'CCofficial_name', 'CClimit', 'CCbalances_current') ";
    var CreditCard =
      "INSERT INTO Credit_Cards (institution_id,account_id,name,mask,official_name,account_limit,balances_current) VALUES (?,?,?,?,?,?,?) ";
    // console.log("QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER" + CreditCard)
    if (dataInsert === true) {
      console.log("Data INserted IFF");
      console.log(
        "QUERY Inserted SUCCESSFULLY Completed Bank : ====================== " +
          insName
      );
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Bank (institution_id,access_token,item_id,institution_name) VALUES (?,?,?,?) ",
          [insID, access_token, item_id, insName],
          (tx, results) => {
            console.log(
              "QUERY Inserted SUCCESSFULLY Completed Bank : ====================== " +
                results.rows.length
            );
            //this.CreditDataInsert(insID)
          }
        );
      });

      var ccdata = this.state.acc;
      db.transaction((txn) => {
        console.log(
          "QUERY Inserted SUCCESSFULLY Completed CreditCards: ====================== item_id : " +
            item_id +
            " Account id : " +
            CCaccount_id +
            " Name : " +
            CCname +
            " MAsk : " +
            CCmask +
            "O  NAme  : " +
            CCofficial_name +
            " Limit : " +
            CClimit +
            " Balance : " +
            CCbalances_current
        );
       
        txn.executeSql(
          CreditCard,
          [
            insID,
            CCaccount_id,
            CCname,
            CCmask,
            CCofficial_name,
            CClimit,
            CCbalances_current,
          ],
          (txn, results) => {
            console.log(
              "QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER HELLO"
            );
            console.log(
              "QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER NEW: ====================== " +
                results.rows.length
            );
            this.GetDataCredit();
            
          }
        );
      });

     
      
    } else {
      console.log("Data INserted ELSE");
      this.GetAllDatafromDB();
    }
  };

  StoreDBNew = (
    insID,
    insName,
    account_id,
    name,
    mask,
    official_name,
    aclimit,
    current
  ) => {
    const {
      count,
      client_id,
      secret,
      pubilckey,
      env,
      institution_id,
      access_token,
      item_id,
      CCaccount_id,
      CCname,
      CCmask,
      CCofficial_name,
      CClimit,
      CCbalances_current,
      dataInsert,
    } = this.state;
    //var CreditCard = "INSERT INTO Credit_Cards (institution_id,account_id,name,mask,official_name,account_limit,balances_current) VALUES ('insID', 'CCaccount_id', 'CCname', 'CCmask', 'CCofficial_name', 'CClimit', 'CCbalances_current') ";
    var CreditCard =
      "INSERT INTO Credit_Cards (institution_id,account_id,name,mask,official_name,account_limit,balances_current) VALUES (?,?,?,?,?,?,?) ";
    // console.log("QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER" + CreditCard)
    if (dataInsert === true) {
      console.log("Data INserted IFF");
      console.log(
        "QUERY Inserted SUCCESSFULLY Completed Bank : ====================== " +
          insName
      );
     
      var ccdata = this.state.acc;
      db.transaction((txn) => {
        console.log(
          "QUERY Inserted SUCCESSFULLY Completed CreditCards: ====================== item_id : " +
            item_id +
            " Account id : " +
            CCaccount_id +
            " Name : " +
            CCname +
            " MAsk : " +
            CCmask +
            "O  NAme  : " +
            CCofficial_name +
            " Limit : " +
            CClimit +
            " Balance : " +
            CCbalances_current
        );
          txn.executeSql(
          CreditCard,
          [insID, account_id, name, mask, official_name, aclimit, current],
          (txn, results) => {
            console.log(
              "QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER HELLO"
            );
            console.log(
              "QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER NEW: ====================== " +
                results.rows.length
            );
            this.GetDataCredit();
            
          }
        );
      });

     
    } else {
      console.log("Data INserted ELSE");
      this.GetAllDatafromDB();
    }
  };

  GetDataCredit = () => {
    var ccdata = [];
    var Tmp = [];
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Credit_Cards", [], (tx, results) => {
        console.log(
          "QUERY SELECTED SUCCESSFULLY Completed Credit_Cards OTHER HELLO LENGTH : " +
            JSON.stringify(results.rows.length)
        );
        for (let i = 0; i < results.rows.length; i++) {
          console.log(
            "QUERY SELECTED SUCCESSFULLY Completed Credit_Cards OTHER HELLO FOR LOOP : " +
              JSON.stringify(results.rows.item(i))
          );
          ccdata.push(results.rows.item(i));
        }
        console.log(
          "QUERY SELECTED SUCCESSFULLY Completed Credit_Cards OTHER HELLO IN : " +
            ccdata
        );
        this.setState({ acc: ccdata, activity_indicator: false }, () => {
          console.log(
            "QUERY SELECTED SUCCESSFULLY Completed Credit_Cards OTHER HELLO SET STATE" +
              JSON.stringify(this.state.acc)
          );
        });
      });
    });
    console.log(
      "QUERY SELECTED SUCCESSFULLY Completed Credit_Cards OTHER HELLO OUT" +
        JSON.stringify(ccdata)
    );
  };

  GetAllDatafromDB = () => {
    var DBD = [];
    var DDBINS = [];
    var DDBINSNAME = [];
    var CDB = [];
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Client_Master", [], (tx, results) => {
        // for (let i = 0; i > results.rows.length; i++) {
        console.log(
          "QUERY ALL Completed Client Master: ===== " + results.rows.length
        );
        //     CMDB = results.rows.item(i)
        //     this.setState({})
        // }
      });
    });
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Bank", [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          console.log(
            "GetAllDatafromDB" + JSON.stringify(results.rows.item(i))
          );
          console.log("GetAllDatafromDB : " + i);
          DBD.push(results.rows.item(i));
          DDBINS.push(results.rows.item(i).institution_id);
          DDBINSNAME.push(results.rows.item(i).institution_name);
        }
      });
    });
    this.setState(
      { BankDb: DBD, selectInstitute: DDBINS, selectInstituteName: DDBINSNAME },
      () => {
        //this.getaccessToken()
        //this.setname();
        console.log(
          "QUERY ALL Completed Bank STATE Loop OUT STATE: ===== : " +
            JSON.stringify(this.state.BankDb)
        );
        console.log(
          "QUERY ALL Completed Bank STATE Loop OUT STATE INSTITUDE ID : ===== : " +
            JSON.stringify(this.state.selectInstitute)
        );
        console.log(
          "QUERY ALL Completed Bank STATE Loop OUT STATE INSTITUDE ID : ===== : " +
            JSON.stringify(this.state.selectInstituteName)
        );
      }
    );
    this.GetDataCredit();
    //this.GetlistInstitute()
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Credit_Cards", [], (tx, results) => {
        for (let k = 0; k < results.rows.length; k++) {
          console.log(
            "QUERY Inserted SUCCESSFULLY Completed CreditCards OTHER HELLO" +
              JSON.stringify(results.rows.item(k))
          );
          ccdata.push(results.row.item(k));
        }
      });
      this.setState({ acc: ccdata });
    });
  
    //console.log("QUERY ALL Completed Bank STATE Loop OUT: =====" + JSON.stringify(DBD))
  };
  // okDB = () => {
  //     console.log("DBOPEN VALUE  : ")
  // }

  getaccessToken = () => {
   

    //const accesstoken = this.state.BankDb[0].access_token;
    console.log("QUERY BANKDB : ==============" + this.state.DBaccesstoken);
    //console.log("COMPONANENT " + accesstoken)
    if (this.state.DBaccesstoken !== null) {
      this.setState({ activity_indicator: true }, () => {
        // console.log("COMPONANENT @ : === " + accesstoken)
        //var at = accesstoken
        //this.setState({ access_token: at },()=>{
        //this.Getapi_Auth(this.state.DBaccesstoken)
      });
      //})
    }
    //this.GetlistInstitute()
  };

  onLoadCall = async () => {
    console.log("Component DID MOUNT :  ");
    //this.GetAllDatafromDB()
    const rounup = await AsyncStorage.getItem("@Round-Up");
    const user_Id = await AsyncStorage.getItem("@User_Id");
    //var ui = parseInt(user_Id)
    console.log("Round Up : " + JSON.stringify(rounup));
    this.setState({ rounup, User_Id: user_Id }, () => {
      console.log("Round Up Home Screem: " + JSON.stringify(this.state.rounup));
      console.log("User Id Home Screen: " + this.state.User_Id);
      this.props.GetlistAccount(this.state.User_Id);
      // this.createHandelData()
      //this.GetlistInstitute()
    });
  };

  setOneSignalTokenMethod = async () => {
    const user_Id = await AsyncStorage.getItem("@User_Id");
    const token = global.onesignalToken;
    this.props.setOneSignalToken(user_Id, token);
  };

  setcurrenttimetext = () => {
    var time = new Date().getHours();
    console.log("Timeee hour: " + time);
    if (time >= 6 && time < 12) {
      this.setState({ timetext: "Good Morning" });
    } else if (time >= 12 && time < 18) {
      this.setState({ timetext: "Good Afternoon" });
    } else if (time >= 18) {
      this.setState({ timetext: "Good Evening" });
    }
  };

  async componentDidMount() {
    // console.log("nextProps.userLoginData : "+JSON.stringify(this.props.userLoginData))
    this.reload();
    var bank_url = this.props.userLoginData.Bank_URL;
    if (bank_url != null) {
      await AsyncStorage.setItem("@Url", this.props.userLoginData.Bank_URL);
    } else {
      await AsyncStorage.removeItem("@Url");
    }
    console.log("ONEsignalNotifiaction Token : " + global.onesignalToken);
    //this.getaccessToken()
    this.setOneSignalTokenMethod();
    this.setcurrenttimetext();
    this.onLoadCall();
   
  }
 
  //===========================================

  setDataToDB = (tmpaccount) => {
    //var acData = this.state.newacc;
    var acData = [];
    var add = true;
    // console.log(
    //   'Temp Acoount Dataaaaa: SET DATA ' +
    //     JSON.stringify(tmpaccount.accountdata),
    // );
    // console.log(
    //   'Temp Acoount Dataaaaa: SET DATA LENGTH ' + tmpaccount.accountdata.length,
    // );
    // console.log('Temp Acoount Dataaaaa: ', tmpaccount.accountdata);
    if (
      tmpaccount.accountdata[0].error_code === undefined &&
      tmpaccount.accountdata.length > 0
    ) {
      for (let i = 0; i < tmpaccount.accountdata.length; i++) {
        console.log(
          "Temp Acoount Dataaaaa: " +
            i +
            " " +
            JSON.stringify(tmpaccount.accountdata[i])
        );
        if (tmpaccount.accountdata[i].error_code === undefined) {
          for (var k = 0; k < tmpaccount.accountdata[i].accounts.length; k++) {
            for (var j = 0; j < this.state.deleterecord.length; j++) {
              //console.log("ID is Deleted OUT IF : " + this.state.deleterecord[j])
              if (
                this.state.deleterecord[j] ===
                tmpaccount.accountdata[i].accounts[k].account_id
              ) {
                console.log(
                  "ID is Deleted : " +
                    tmpaccount.accountdata[i].accounts[k].account_id
                );
                add = false;
                break;
              }
              // else {
              //     break
              //     acData.push(tmpaccount.accountdata[i].accounts[k])
              // }
            }
            if (add === true) {
              acData.push(tmpaccount.accountdata[i].accounts[k]);
              console.log(
                "Bank Acc Id : " +
                  tmpaccount.accountdata[i].accounts[k].account_id
              );
            } else {
              add = true;
            }
          }
        }
       
      }
      this.setState({ newacc: acData }, () => {
       
      });
    } else {
      this.setState({ noBankFound: true });
    }
  };

  deleteRecord = (tmpaccount) => {
    console.log("tmpaccount.accountdata {} : " + tmpaccount.accountdata.length);
    var deldata = this.state.deleterecord;
    if (
      tmpaccount.accountdata.length > 0 &&
      tmpaccount.accountdata[0].error_code == undefined
    ) {
      if (tmpaccount.accountdata.length > 0) {
        // console.log('Bank Acc Delete Id : ' + tmpaccount.deletedaccount);
        for (let i = 0; i < tmpaccount.deletedaccount.length; i++) {
          //for (var k = 0; k < tmpaccount.deletedaccount[i].length; k++){
          console.log(
            "Bank Acc Delete Id : " + tmpaccount.deletedaccount[i].accountId
          );
          deldata.push(tmpaccount.deletedaccount[i].accountId);
          
        }
        this.setState({ deleterecord: deldata }, () => {
          console.log("ACC Data : " + JSON.stringify(this.state.deleterecord));
        });

        this.setDataToDB(tmpaccount);
      }
      // this.setDataToDB(tmpaccount);
    } else {
      this.setState({ noBankFound: true });
    }
  };

  // OLD APISS (PLAID)
  fetchApi = (url, options, insID, insName, i) => {
    var token = null;
    fetch(url, options)
      .then((response) => {
        response
          .json()
          .then((body) => {
            console.log("CREATE_SUCCESS" + JSON.stringify(body));
            token = body.public_token;
            console.log("CREATE_SUCCESS TOKEN" + JSON.stringify(token));
            this.Getapi_ExcahngeToken(token, insID, insName);
          })
          .catch((error) => {
            console.log(
              "CREATE_SUCCESS_SOMETHING_WRONG" + JSON.stringify(error)
            );
          });
      })
      .catch((error) => {
        console.log("CREATE_PENDING_FAIL" + JSON.stringify(error));
      });
    if (this.state.selectInstitute.length === i + 1) {
      this.setState({ selectInstitute: [], Sel_Ind_ID: [] }, () => {
        console.log("SELECTED INDEX " + i);
        console.log("SELECTED INDEX Sel_INd" + this.state.Sel_Ind_ID.length);
        console.log(
          "SELECTED INDEX selectInstitute" + this.state.selectInstitute.length
        );
      });
    }
  };

  GetapiCreate = async () => {
    var insID = null;
    //console.log("QUERY ALL CREATE PUBLIC_TOKEN === " + JSON.stringify(this.state.selectInstitute[1].name))
    for (let i = 0; i < this.state.Sel_Ind_ID.length; i++) {
      //console.log("Token : " + JSON.stringify(this.state.selectInstitute[i].institution_id))
      insID = this.state.Sel_Ind_ID[i];
      var insName = [];
      console.log("Token GETAPI CREATE" + insID);
      this.setState({ activity_indicator: true, InstituteDB: insID }, () => {
        console.log(
          "Token Selectinstitute : " + JSON.stringify(this.state.InstituteDB)
        );
      });
      var url = baseUrl + "sandbox/public_token/create";
      var params = {
        public_key: "20758587172f3a5fe3f489862704b7",
        //institution_id: this.state.selectInstitute[i].institution_id,
        institution_id: this.state.Sel_Ind_ID[i],
        //institution_id: 'ins_112062',
        initial_products: ["auth"],
      };
      var options = {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      };
      for (let k = 0; k < this.state.selectInstitute.length; k++) {
        console.log(
          "INS NAME  Data Base +++++++++++++ +++++++================ " +
            this.state.selectInstitute[k].institution_id
        );
        console.log(
          "INS NAME  Selected Name+++++++++++++ +++++++================ " +
            this.state.Sel_Ind_ID[k]
        );
        for (let j = 0; j < this.state.Sel_Ind_ID.length; j++) {
          if (
            this.state.selectInstitute[k].institution_id ===
            this.state.Sel_Ind_ID[j]
          ) {
            insName.push(this.state.selectInstitute[k].name);
          }
        }
      }

      console.log(
        "INS NAME  RESULTS +++++++++++++ +++++++================ " + insName[i]
      );

      this.setState({ activity_indicator: false });
      console.log(
        "Acccresss TOkkkeeeeennnnnn ====================== " +
          JSON.stringify(params)
      );

      // this.fetchApi(url, options, this.state.selectInstitute[i].institution_id, this.state.selectInstitute[i].name)
      this.fetchApi(url, options, this.state.Sel_Ind_ID[i], insName[i], i);
    }
  };

  Getapi_ExcahngeToken = (data, insID, insName) => {
    const { activity_indicator } = this.state;

    var token = data;
    console.log("GETAPI EXCHANGE : " + token);
    console.log("GETAPI_EXCHANGE_CREATE");
    var url = baseUrl + "item/public_token/exchange";
    var params = {
      client_id: "5e1f2ab221bd680011c48126",
      secret: "9ac4ed6b27962ed2f2c289f84c7ba4",
      public_token: token,
    };
    var options = {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Access TOken :   " + JSON.stringify(options));
    var accesstoken = null;
    fetch(url, options)
      .then((response) => {
        response
          .json()
          .then((body) => {
            console.log("CREATE_EXCHANGE_SUCCESS : " + JSON.stringify(body));
            accesstoken = body.access_token;
            console.log(
              "CREATE_EXCHANGE_SUCCESS PASS DATA : " +
                JSON.stringify(accesstoken)
            );
            this.setState({ access_token: body.access_token }, () => {
              console.log(
                "CREATE_EXCHANGE_SUCCESS PASS DATA : " +
                  JSON.stringify(this.state.access_token)
              );
              this.Getapi_Auth(this.state.access_token, insID, insName);
            });
          })
          .catch((error) => {
            console.log(
              "CREATE_EXCHANGE_SUCCESS_SOMETHING_WRONG : " +
                JSON.stringify(error)
            );
          });
      })
      .catch((error) => {
        console.log("CREATE_EXCHANGE_PENDING_FAIL" + JSON.stringify(error));
      });
  };

  Getapi_Auth = async (data, insID, insName) => {
    const { activity_indicator } = this.state;

    // console.log("")
    var token = data;
    console.log("THIS STATE AT" + this.state.access_token);
    console.log("GETAPI_AUTH_CREATE" + data);
    var url = baseUrl + "auth/get";
    if (this.state.access_token !== null) {
      token = this.state.access_token;
    } else {
      token = data;
    }
    console.log("GETAPI AUTH : " + token);
    var params = {
      client_id: "5e1f2ab221bd680011c48126",
      secret: "9ac4ed6b27962ed2f2c289f84c7ba4",
      access_token: token,
    };
    var options = {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    };
    var accesstoken = null;
    console.log("AUTH Access Token : " + JSON.stringify(options));
    fetch(url, options)
      .then((response) => {
        response
          .json()
          .then((body) => {
            console.log("CREATE_AUTH_SUCCESS" + JSON.stringify(body));
            this.setState(
              {
                tmpArray_1: body.accounts[0],
                acc_id: body.accounts[3].account_id,
                card_No: body.accounts[3].mask,
                item_id: body.item.item_id,
                CCaccount_id: body.accounts[3].account_id,
                CCname: body.accounts[3].name,
                CCmask: body.accounts[3].mask,
                CCofficial_name: body.accounts[3].official_name,
                CClimit: body.accounts[3].balances.limit,
                CCbalances_current: body.accounts[3].balances.current,
              },
              () => {
                //console.log("Account : " + JSON.stringify(this.state.acc.balances.current))
                // this.StoreDB();
                accesstoken = body.access_token;
              }
            );
            //console.log("")
            this.setAccessTOKEN(
              token,
              body,
              insID,
              insName,
              body.accounts[3].account_id,
              body.accounts[3].name,
              body.accounts[3].mask,
              body.accounts[3].official_name,
              body.accounts[3].balances.limit,
              body.accounts[3].balances.current
            ),
              () => {
                console.log(
                  "CREATE_AUTH_SUCCESS" + JSON.stringify(body.access_token)
                );
                console.log("CREATE_AUTH_SUCCESS" + JSON.stringify(body));
              };
            //this.StoreDB();
          })
          .catch((error) => {
            console.log(
              "CREATE_AUTH_SUCCESS_SOMETHING_WRONG" + JSON.stringify(error)
            );
          });
      })
      .catch((error) => {
        console.log("CREATE_AUTH_PENDING_FAIL" + JSON.stringify(error));
      });
    this.setState({ activity_indicator: false });
  };

  setAccessTOKEN = async (
    data,
    body,
    insID,
    insName,
    account_id,
    name,
    mask,
    official_name,
    limit,
    current
  ) => {
    var SelName = this.state.selectInstituteName;
    SelName.push(insName);
    console.log("SET Token : " + data);
   
    this.setState(
      { navAccessToken: data, selectInstituteName: SelName },
      () => {
        console.log("Loopp Dattaaaa ========================" + this.state.acc);
      }
    );
    if (this.state.dataInsert === true) {
      this.StoreDB(
        insID,
        insName,
        account_id,
        name,
        mask,
        official_name,
        limit,
        current
      );
    }
  };

  setAccessTOKENNew = (
    account_id,
    name,
    mask,
    official_name,
    limit,
    current
  ) => {
    
    //============
  };

  setModalVisible = (visible, value) => {
    if (value === true) {
      //this.DeleteRecord()
      //Old Code
      //this.DeleteRecordNew()
      console.log(
        "Deleta Data : " +
          this.state.User_Id +
          " Selected ID : " +
          this.state.selectdeleteId
      );
      this.props.DeleteAccountToApi(
        this.state.User_Id,
        this.state.selectdeleteId,
        this.state.mask
      );
      this.setState({ ModalVisible: visible });
    } else {
      this.setState({ ModalVisible: visible });
    }
  };

  setModalVisible_Ext = (visible) => {
    this.setState({
      ModalVisible_Exists_Institution: visible,
      activity_indicator: false,
    });
  };

  toggleSwitch1 = (value) => {
    this.setState({ switch1Value: value });
    console.log("Switch 1 is: " + value);
  };

  naviagteToTransaction = (account_id, mask, type) => {
    console.log("Mask NO: " + mask);
    //this.props.navigation.navigate('Transcationscreen', { accessToken: this.state.navAccessToken, ac_Id: this.state.acc_id, CC_No: this.state.card_No })
    this.props.navigation.navigate("Transcationscreen", {
      accessToken: this.state.navAccessToken,
      ac_Id: account_id,
      CC_No: this.state.card_No,
      mask: mask,
      type: type,
    });
  };

  setInstitute_Visible = (value) => {
    this.setState({ institute_Visible: value });
  };

  selInstitute = (index) => {
    this.setState({ currentID: index });
  };

  

  selectInstituteSingle = (index) => {
    console.log("Selected index : " + JSON.stringify(index.institution_id));
    this.setState(
      {
        selectInstituteSingle: index.institution_id,
        singleInsName: index.name,
      },
      () => {
        console.log(
          "Selected index : " + JSON.stringify(this.state.selectInstituteSingle)
        );
        console.log(
          "Selected index : " + JSON.stringify(this.state.singleInsName)
        );
      }
    );
  };

  selectInstituteMutiple = (index) => {
    console.log("METHOD CALL ");
    var count = 0;
    var selColor = this.state.tempidx;
    var selids = [];
    console.log("Selected index : " + JSON.stringify(index));
    console.log("Selected index IFFFF Length : " + this.state.tempidx.length);
    var exits = false;
    if (this.state.tempidx.length === 0) {
      console.log("Selected index IFFFF Length ADD: " + this.state.tempidx);
      this.state.tempidx.push(index);
    } else {
      for (var i = 0; i < this.state.tempidx.length; i++) {
        console.log("Selected index  for: " + this.state.selectedIndex[i]);
        if (this.state.tempidx[i] === index) {
          console.log(
            "Selected index  IFFFF ======= : " + this.state.tempidx[i]
          );
          //this.state.tempidx.push(index)
          count += 1;
          if (count > 0) {
            exits = true;
            break;
          }
        }
      }
      if (exits === true) {
        console.log("Splice");
        this.state.tempidx.splice(i, 1);
      } else {
        this.state.tempidx.push(index);
      }
      console.log(
        "Selected index  IFFFF  Out: ===========" + this.state.tempidx
      );
    }
    this.setState({ selectInstitute: this.state.tempidx }, () => {
      console.log(
        "Selected index SelIDX  IFFFF VALUE : ================================" +
          JSON.stringify(this.state.selectInstitute)
      );
    });
    
  };

  swipOut = (value, mask, index) => {
    // console.log('Swipe OUT  : ' + mask);
    console.log("Swipe OUT  : " + JSON.stringify(this.state.newacc[index]));
    this.setState(
      { DeleteInstitute_Id: value, selectdeleteId: value, mask: mask },
      () => {
        // console.log('Swipe OUT  : ' + value);
        // console.log('Swipe OUT  : ' + this.state.DeleteInstitute_Id);
      }
    );
  };
  OpenInstitution = () => {
    this.setState({ plaidsdk: true });
    this.setState({ selectInstitute: [], Sel_Ind_ID: [], tempidx: [] }, () => {
      this.setState({ institute_Visible: true });
    });
  };

  reload = async () => {
    const rounup = await AsyncStorage.getItem("@Round-Up");
    const user_Id = await AsyncStorage.getItem("@User_Id");
   
    if (this.props.userLoginData.Country === "Canada") {
      var arr = ["CA"];
      this.setState({ userCountry: arr });
    } else {
      var arr = ["US"];
      this.setState({ userCountry: arr });
    }
    console.log("Round Up : " + JSON.stringify(user_Id));
    // this.props.GetlistAccount(user_Id);
    this.setState({ newacc: [], deleterecord: [] }, () => {
      this.onLoadCall();
      console.log("Round Up : " + JSON.stringify(rounup));
      this.setState({ rounup }, () => {
        console.log("Round Up : " + JSON.stringify(this.state.rounup));
        // this.GetlistAccount();
      });
    });
  };
  createHandelData = (data) => {
    
    var public_token = data.public_token;
    var bank_id = data.link_connection_metadata.institution_id;
    var bank_name = data.link_connection_metadata.institution_name;
    console.log("Plaid Bank Data : " + JSON.stringify(data));
    console.log("Bank Id : " + bank_id);
    console.log("public Token : " + public_token);
    console.log("Bank Name : " + bank_name);
    this.setState(
      {
        res_bank_id: bank_id,
        res_public_token: public_token,
        res_bank_name: bank_name,
      },
      async () => {
        await this.props.AddInstituteAccount(
          this.state.User_Id,
          public_token,
          bank_id,
          bank_name
        );
        await this.props.DeleteAllDatatoDeleteAccount(
          this.state.User_Id,
          this.state.res_bank_id
        );
      }
    );
  };

  checkString = (str) => {
    // console.log()
    return str.length === 1 && str.match(/[a-z]/i);
  };

  render() {
    const {
      activity_indicator,
      institute_Visible,
      institute_list,
      institute_selected_list,
      plaidsdk,
    } = this.state;
    var acInd = false;
    var swipeoutBtns = [
      {
        text: "Delete",
        backgroundColor: "#ff5050",
        onPress: () => {
          this.setModalVisible(true);
        },
      },

      // {
      //     text: 'Edit',
      //     backgroundColor: '#21ce99',
      //     onPress: () => { this.props.navigation.navigate('EditCardFrontScreen') },
      // },
    ];
    // if (this.state.acc.length > 0) {
    console.log("LENGTH ======================= " + this.state.timetext);
    // }
    // console.log("ACCCCCCCC ======================= " + JSON.stringify(this.state.acc))

    return (
      <View style={styles.MainContainer}>
        <NavigationEvents onWillFocus={() => this.reload()} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.ModalVisible}
          onRequestClose={() => {}}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              opacity: 1,
              justifyContent: "center",
              backgroundColor: "rgba( 0,0,0,0.5 )",
            }}
          >
            <View style={styles.whitebox}>
              <View style={styles.modaltitle}>
                <Text style={[styles.Headertitletxt, { fontSize: 15 }]}></Text>
              </View>
              <View style={styles.modaldetails}>
                <Text
                  style={[
                    styles.Headertitletxt,
                    { fontSize: 20, textAlign: "center" },
                  ]}
                >
                  With deletion of card all transactions and related records
                  will be removed from your history. Are you sure to delete card
                  ?
                </Text>
              </View>
              <View style={styles.modalBtnView}>
                <HalfButton
                  buttonText={"No"}
                  onPress={() => {
                    this.setModalVisible(!this.state.ModalVisible);
                  }}
                  buttonTextStyle={styles.btntxt}
                  buttonStyle={styles.btnstyleDismiss}
                ></HalfButton>
                <HalfButton
                  buttonText={"Yes"}
                  onPress={() => {
                    this.setModalVisible(!this.state.ModalVisible, true);
                  }}
                  buttonTextStyle={styles.btntxt}
                  buttonStyle={styles.btnstyleGo}
                ></HalfButton>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.ModalVisible_Exists_Institution}
          onRequestClose={() => {}}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              opacity: 1,
              justifyContent: "center",
              backgroundColor: "rgba( 0,0,0,0.5 )",
            }}
          >
            <View style={styles.whitebox}>
              <View style={styles.modaltitle}>
                <Text style={[styles.Headertitletxt, { fontSize: 18 }]}>
                  Allready Exits Institute Can not add
                </Text>
              </View>
              <View style={styles.modaldetails}>
                <Text
                  style={[
                    styles.Headertitletxt,
                    { fontSize: 20, textAlign: "center" },
                  ]}
                >
                  Institute Name As follow : {this.state.DeleteInsName}
                </Text>
              </View>
              <View style={styles.modalBtnView}>
                <HalfButton
                  buttonText={"OK"}
                  onPress={() => {
                    this.setModalVisible_Ext(false);
                  }}
                  buttonTextStyle={styles.btntxt}
                  buttonStyle={styles.btnstyleDismissYes}
                ></HalfButton>
              </View>
            </View>
          </View>
        </Modal>
        {/* 'auth',
      'identity',
      'income',
      'transactions',
      'assets',
      'liabilities',
      'investments', */}
        <View style={styles.Headers_view_style}>
          <Text style={styles.TextStyle}>My Cards</Text>
          <View>
            <PlaidLink
              clientName="CredIt"
              publicKey="20758587172f3a5fe3f489862704b7"
              env="development"
              onSuccess={(data) => {
                this.createHandelData(data);
              }}
              onExit={(data) => console.log("exit: ", data)}
              onCancelled={(result) => {
                console.log("Cancelled: ", result);
              }}
              product={["transactions"]}
              language="en"
              countryCodes={this.state.userCountry}
             
            >
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                {/* <TouchableOpacity onPress={() => { this.OpenInstitution() }} style={{ alignItems: 'center', flexDirection: 'row' }} > */}
                {/* <TouchableOpacity onPress={() => { this.setState({PlaidClick:true}) }} style={{ alignItems: 'center', flexDirection: 'row' }} > */}
                <Text style={styles.Add_more_text_style}>Add Card</Text>
                <Image
                  style={styles.fab_btn_style}
                  source={require("../../assets/assets/images/fab.png")}
                ></Image>
                {/* </TouchableOpacity> */}
              </View>
              {/* <PlaidLink
                            clientName ={"Andry Lindsay"}
                            env ={"development"}
                            onSuccess ={(data)=>{console.log("Data : "+data)}}
                            product ={['auth']}

                            >
                            <Text>Add Account</Text>
                        </PlaidLink> */}
            </PlaidLink>
          </View>
        </View>
        {this.state.noBankFound ? (
          <View style={[styles.noBankViewStyle]}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {this.state.timetext}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {this.props.userLoginData.FirstName}
            </Text>
            <Text
              style={[
                styles.noBankTextStyle,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  paddingVertical: 5,
                },
              ]}
            >
              You have no cards, please add one.
            </Text>
            <View
              style={{
                width: width,
                backgroundColor: "#94ba33", // remove as per 11-09
                height: 5,
              }}
            />
          </View>
        ) : (
          <View>
            {
              <View style={{ height: 85 }}>
                <View
                  style={[
                    styles.Headers_view_style_del,
                    {
                      height: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 1,
                      //backgroundColor:'#f3f3f3'
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {this.state.timetext}
                  </Text>
                </View>
                <View
                  style={[
                    styles.Headers_view_style_del,
                    {
                      height: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 1,
                      //backgroundColor:'#f3f3f3'
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {this.props.userLoginData.FirstName}
                  </Text>
                </View>
              </View>
            }
            <View
              style={{
                width: width,
                backgroundColor: "#94ba33", // remove as per 11-09
                height: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#fdfdfd", // remove as per 11-09
                }}
              ></Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                paddingBottom: 25,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.Swipe_view_container}>
                <View
                  style={[
                    styles.Headers_view_style_del,
                    { height: "5%", padding: 0 },
                  ]}
                >
                  <Text style={styles.TextStyle_del}>Swipe left to delete</Text>
                </View>
                {this.state.newacc.map(
                  (item, index) =>
                    item.type === "credit" && (
                      //item.balances !== undefined &&
                      <Swipeout
                        right={swipeoutBtns}
                        style={styles.Swipe_main_view}
                        autoClose="true"
                        //onOpen={() => this.swipOut(item.institution_id)}
                        onOpen={() =>
                          this.swipOut(item.account_id, item.mask, index)
                        }
                        // onPress = {()=>this.swipOut(item.institution_id)}
                      >
                        <TouchableOpacity
                          style={styles.Card_main_view}
                          onPress={() =>
                            this.naviagteToTransaction(
                              item.account_id,
                              item.mask,
                              item.type
                            )
                          }
                        >
                          <ImageBackground
                            source={
                              index === 0
                                ? require("../../assets/assets/images/gradient_credit_card11.png") // orange
                                : index / 1 === 1
                                ? require("../../assets/assets/images/gradient_credit_card10.png") //yellow
                                : index / 2 === 1
                                ? require("../../assets/assets/images/gradient_credit_card12.png") // red
                                : require("../../assets/assets/images/gradient_credit_card10.png") // blue-green
                            }
                            style={styles.Image_background_container}
                          >
                            <View style={styles.Inside_card_container}>
                              <View
                                style={styles.Bank_name_N_card_number_container}
                              >
                                <View style={styles.Bank_name_n_icon_container}>
                                  <Icon
                                    name="university"
                                    size={30}
                                    style={{
                                      color: "#ffca28",
                                      marginRight: 5,
                                    }}
                                  ></Icon>
                                  <Text style={styles.Name_text_style}>
                                    {this.checkString(item.name[0]) &&
                                      item.name}
                                  </Text>
                                  {/* <Text style={styles.Name_text_style}>DEMO</Text> */}
                                </View>
                                <View style={styles.account_number_container}>
                                  <Text style={styles.starTxt}>****</Text>
                                  <Text style={styles.cardNumtxt}>
                                    {item.mask}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  marginTop: 50,
                                  position: "absolute",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Image
                                  style={{ height: 60, width: 60 }}
                                  source={require("../../assets/assets/images/CreditChip.png")}
                                />
                              </View>
                              <View style={styles.Belance_n_date_container}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={styles.Current_balance_text_style}
                                  >
                                    CURRENT BALANCE
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text style={styles.Money_text_style}>
                                    ${" "}
                                    {item.balances.current === null
                                      ? "000"
                                      : this.state.rounup === "true"
                                      ? Math.ceil(item.balances.current)
                                      : item.balances.current}
                                  </Text>
                                </View>
                                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={styles.Money_text_style}>$ DEMO</Text></View> */}
                              </View>
                              <View
                                style={styles.available_balance_conatiner}
                              ></View>
                              <View
                                style={{
                                  height: 50,
                                  width: 50,
                                  backgroundColor: "#bfd2c3",
                                  borderRadius: 30,
                                  position: "absolute",
                                  bottom: -25,
                                  left: -25,
                                }}
                              >
                                <View
                                  style={{
                                    marginTop: 10,
                                    marginLeft: 9,
                                    height: 30,
                                    width: 30,
                                    backgroundColor:
                                      index === 0
                                        ? "#f84201" // orange
                                        : index / 1 === 1
                                        ? "#0ea463" //yellow   #d6d102
                                        : index / 2 === 1
                                        ? "#980000" // red
                                        : "#0ea463", // blue-green
                                    borderRadius: 30,
                                  }}
                                ></View>
                              </View>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      </Swipeout>
                    )
                )}
              </View>
            </ScrollView>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={institute_Visible}
          onRequestClose={() => {
            this.setInstitute_Visible(!this.state.institute_Visible);
          }}
        >
          <View style={styles.outside_view}>
            <View style={styles.whitebox_institute}>
              <View
                style={{
                  height: 30,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1, alignItems: "center", marginLeft: 50 }}>
                  <Text style={{ color: "#000", fontSize: 22 }}>
                    Select Bank
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ alignItems: "flex-end" }}
                  onPress={() => {
                    this.setInstitute_Visible(!this.state.institute_Visible);
                  }}
                >
                  <Close
                    name="closesquare"
                    size={30}
                    style={{ color: "red", marginRight: 5 }}
                  ></Close>
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
              >
                {/* <RefreshControl refreshing={() => { alert("ref") }} onRefresh={() => { alert("Refresh") }}> */}
                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                  {institute_list !== null &&
                  institute_list !== undefined &&
                  institute_list.length > 0 ? (
                    institute_list.map((item, index) => {
                      if (item.products[1] === "auth") {
                        var color = false;

                        if (
                          this.state.selectInstituteSingle ===
                          item.institution_id
                        ) {
                          // console.log("QUERY COLOOR" + JSON.stringify(this.state.selectInstitute[i]))
                          color = true;
                        }
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.selectInstituteSingle(item);
                              this.setState({ dataInsert: true }, () => {});
                            }}
                            style={styles.row}
                          >
                            <View
                              style={[
                                styles.itemView,
                                {
                                  backgroundColor:
                                    color === false ? "#fff" : "#94ba33",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.item_txt,
                                  {
                                    color: color === false ? "#94ba33" : "#fff",
                                  },
                                ]}
                              >
                                {item.name}{" "}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      } else {
                        // console.log("FALSE  ====== :::::::::::::: ======")
                      }
                    })
                  ) : (
                    <View
                      style={{
                        height: 250,
                        width: "100%",
                        marginHorizontal: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 250,
                        right: 10,
                        elevation: 5,
                      }}
                    >
                      <ProgressBarAndroid
                        styleAttr={"Inverse"}
                        style={{ color: "#ff593b" }}
                        progress={10}
                        indeterminate={false}
                      />
                    </View>
                  )}
                </View>
                {/* </RefreshControl> */}
              </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      activity_indicator: true,
                      institute_Visible: false,
                      dataInsert: true,
                    },
                    () => {
                      this.AddInstituteAccount();
                    }
                  );
                }}
                style={{
                  height: 35,
                  width: 150,
                  marginVertical: 15,
                  backgroundColor: "#94ba33",
                  justifyContent: "center",
                  borderWidth: 2,
                  elevation: 1,
                  borderColor: "#94ba33",
                  borderRadius: 5,
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{ textAlign: "center", color: "#fff", fontSize: 16 }}
                >
                  {" "}
                  Done{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={activity_indicator}
          onRequestClose={() => {
            this.setInstitute_Visible(!this.state.activity_indicator);
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              opacity: 1,
              justifyContent: "center",
              backgroundColor: "rgba( 0,0,0,0.5 )",
            }}
          >
            <View
              style={{
                height: 250,
                width: "100%",
                marginHorizontal: 12,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 250,
                elevation: 5,
              }}
            >
              <ProgressBarAndroid
                styleAttr={"Inverse"}
                style={{ color: "#ff593b" }}
                progress={10}
                indeterminate={false}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
function mapStateToProps(state) {
  state = state.ReducerStore;

  return {
    type: state.type,
    add_institute_account: state.add_institute_account,
    get_institute_account_list: state.get_institute_account_list,
    delete_account: state.delete_account,
    delete_account_todelete_account: state.delete_account_todelete_account,
    reducer_message: state.reducer_message,
    onesignal_message: state.onesignal_message,
    userLoginData: state.userLoginData,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      GetlistAccount,
      AddInstituteAccount,
      DeleteAccountToApi,
      DeleteAllDatatoDeleteAccount,
      setOneSignalToken,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
