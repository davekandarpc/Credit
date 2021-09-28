import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from "../../common/ResponsiveLayout";
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const styles = StyleSheet.create(
    {
        MainContainer: {
            flex: 1,
        },
        Headers_view_style: {
            height: 70,
            borderColor: '#f3f3f3',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row'
        },
        Headers_view_style_del: {
            height: 20,
            borderColor: '#f3f3f3',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row',
            //backgroundColor:'yellow'
        },
        TextStyle: {
            fontSize: 30,
            fontWeight: 'bold',
        },
        TextStyle_del: {
            fontSize: 14,
            textAlign: 'center'

        },
        Add_more_text_style: {
            fontSize: 20,
            color: '#94ba33',
            fontWeight: 'bold'
        },
        fab_btn_style: {
            height: 30,
            width: 30,
            resizeMode: 'contain',
            marginLeft: 5
        },
        Swipe_view_container: {
            //flex:1,
            width: '90%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        Card_main_view: {
            height: 210,
            width: '100%',
            borderRadius: 5
        },
        Swipe_main_view: {
            height: 210,
            width: '105%',
            marginVertical: 5,
            borderRadius: 5
        },
        Image_background_container: {
            height: 210,
            width: '100%',
            resizeMode: 'stretch',
            borderRadius: 5
        },
        Inside_card_container: {
            margin: 10,
            flex: 1,
        },
        Bank_name_N_card_number_container: {
            flex: 1,
            flexDirection: 'row'
        },
        Belance_n_date_container: {
            flex: 3,
            justifyContent: "center",
            alignItems: 'center',

        },
        available_balance_conatiner: {
            flex: 1,
            flexDirection: 'row'
        },
        Bank_name_n_icon_container: {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        Name_text_style: {
            color: '#fff',
            fontSize: 19,
            fontWeight: 'bold'
        },
        account_number_container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        card: {
            // width: 40,
            // height: 25,
            borderRadius: 3,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5
        },
        starTxt: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 15,
            marginHorizontal: 5
        },
        cardNumtxt: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 15,
            marginHorizontal: 1
        },
        Current_balance_text_style: {
            fontSize: 18,
            fontWeight: '600',
            color: 'white'
        },
        Money_text_style: {
            fontSize: 23,
            fontWeight: 'bold',
            color: 'white'
        },
        Due_date_text_style: {
            fontSize: 18,
            fontWeight: '600',
            color: 'white'
        },
        Cradit_view_contianer: {
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        available_text_style: {
            fontSize: 15,
            fontWeight: 'bold',
            color: 'white'
        },
        amount_text_style: {
            fontSize: 15,
            fontWeight: 'bold',
            color: 'white'
        },
        more_icon_container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end'
        },
        whitebox: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            backgroundColor: '#fff',
            height: heightPercentageToDP("33%"),
            marginHorizontal: 20,
            marginVertical: 150,
            padding: 20,
            elevation: 2
        },
        modaltitle: {
            margin: 5,
            flex: 1,
        },
        modaldetails: {
            flex: 2
        },
        modalBtnView: {
            margin: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        btnstyleDismiss: {
            borderRadius: 4,
            marginHorizontal: 10,
            backgroundColor: '#ff5b3e',
            justifyContent: 'center',
            height: heightPercentageToDP("7%"),
        },
        btnstyleDismissYes: {
            borderRadius: 4,
            marginHorizontal: 10,
            backgroundColor: '#17d19d',
            justifyContent: 'center',
            height: heightPercentageToDP("7%"),
        },
        btnstyleGo: {
            borderRadius: 4,
            justifyContent: 'center',
            marginHorizontal: 10,
            // backgroundColor: '#17d19d',
            backgroundColor: '#94ba33',
            height: heightPercentageToDP("7%"),
        },
        btntxt: {
            fontSize: heightPercentageToDP("3%"),
            fontWeight: 'bold',
            color: '#fff'
        },
        outside_view: {
            height: 390,
            width: '100%',
            flex: 1,
            alignItems: 'center',
            opacity: 1,
            justifyContent: 'center',
            //marginHorizontal:"20%"

        },
        whitebox_institute: {
            //backgroundColor: '#cddfd6',
            backgroundColor: '#fff',
            height: 530,
            width: '70%',
            //marginHorizontal: 100,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#cddfd6',
            elevation: 5,
            alignSelf: 'center',
        },
        close_img_56_style: {
            resizeMode: 'contain',
            width: 18,
            marginRight: 12,
            height: 18,
            alignSelf: 'flex-end',
            marginBottom: 11,
        },
        row: {
            //padding:5,
            width: '100%',
        },
        itemView: {
            margin: 10,
            marginHorizontal: 10,
            height: 50,
            width: '80%',
            backgroundColor: '#5fe064',
            alignSelf: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 5
        },
        item_txt: {
            color: '#94ba33',
            textAlign: 'center',
            fontSize: 18,
            marginHorizontal: 10,
        },
        linearGradient: {
            height: heightPercentageToDP("0.2%"),

        },

    });