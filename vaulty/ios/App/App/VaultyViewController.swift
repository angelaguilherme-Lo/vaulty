import Capacitor
import WebKit

class VaultyViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(VaultyNativePlugin())
        if #available(iOS 16.4, *) { webView?.isInspectable = false }
    }
}
