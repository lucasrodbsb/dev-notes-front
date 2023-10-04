import Toast, {BaseToast} from "react-native-toast-message"

export const toastConfig = {
    success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', backgroundColor: '#202020' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#fff'
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red', backgroundColor: '#202020' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#fff'
      }}
      
    />
  ),
}