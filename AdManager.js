class AdManager {
    constructor(publisherId, adUnitId) {
        this.publisherId = publisherId;
        this.adUnitId = adUnitId;
        this.isAdLoaded = false;
        this.isInitialized = false;
        
        // Initialize AdMob when running on a mobile device
        this.initialize();
    }
    
    initialize() {
        console.log('Initializing AdMob with Publisher ID:', this.publisherId);
        
        // Check if running in a Cordova/Capacitor environment
        if (typeof document.addEventListener !== 'undefined') {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            console.log('AdMob initialization skipped: Not running in mobile environment');
        }
        
        // For development/testing in browser
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Running in development environment - using mock ads');
            this.isInitialized = true;
            this.loadInterstitial();
        }
    }
    
    onDeviceReady() {
        console.log('Device ready, setting up AdMob');
        
        // Check if AdMob plugin is available
        if (typeof admob !== 'undefined') {
            // Initialize AdMob
            admob.setOptions({
                publisherId: this.publisherId,
                interstitialAdId: this.adUnitId,
                bannerAtTop: false,
                isTesting: false,
                autoShowInterstitial: false
            });
            
            this.isInitialized = true;
            this.loadInterstitial();
            
            console.log('AdMob initialized successfully');
        } else {
            console.warn('AdMob plugin not available');
        }
    }
    
    loadInterstitial() {
        console.log('Loading interstitial ad');
        
        if (!this.isInitialized) {
            console.warn('AdMob not initialized yet');
            return;
        }
        
        // For development/testing in browser
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Mock ad loaded successfully');
            this.isAdLoaded = true;
            return;
        }
        
        // Check if AdMob plugin is available
        if (typeof admob !== 'undefined') {
            admob.prepareInterstitial({
                adId: this.adUnitId,
                autoShow: false
            }, () => {
                console.log('Interstitial ad loaded successfully');
                this.isAdLoaded = true;
            }, (error) => {
                console.error('Failed to load interstitial ad:', error);
                this.isAdLoaded = false;
            });
        }
    }
    
    showInterstitial(callback) {
        console.log('Attempting to show interstitial ad');
        
        if (!this.isInitialized) {
            console.warn('AdMob not initialized yet');
            if (callback) callback();
            return;
        }
        
        // For development/testing in browser
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Showing mock interstitial ad');
            
            // Create a mock ad overlay
            const mockAd = document.createElement('div');
            mockAd.style.position = 'fixed';
            mockAd.style.top = '0';
            mockAd.style.left = '0';
            mockAd.style.width = '100%';
            mockAd.style.height = '100%';
            mockAd.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            mockAd.style.zIndex = '9999';
            mockAd.style.display = 'flex';
            mockAd.style.flexDirection = 'column';
            mockAd.style.justifyContent = 'center';
            mockAd.style.alignItems = 'center';
            mockAd.style.color = 'white';
            mockAd.style.fontFamily = 'Arial, sans-serif';
            
            const adText = document.createElement('div');
            adText.textContent = 'ADVERTISEMENT';
            adText.style.fontSize = '24px';
            adText.style.marginBottom = '20px';
            
            const adInfo = document.createElement('div');
            adInfo.textContent = `AdMob Publisher ID: ${this.publisherId}`;
            adInfo.style.fontSize = '14px';
            adInfo.style.marginBottom = '10px';
            
            const adUnitInfo = document.createElement('div');
            adUnitInfo.textContent = `Ad Unit ID: ${this.adUnitId}`;
            adUnitInfo.style.fontSize = '14px';
            adUnitInfo.style.marginBottom = '30px';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close Ad';
            closeButton.style.padding = '10px 20px';
            closeButton.style.backgroundColor = '#2196F3';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';
            
            mockAd.appendChild(adText);
            mockAd.appendChild(adInfo);
            mockAd.appendChild(adUnitInfo);
            mockAd.appendChild(closeButton);
            
            document.body.appendChild(mockAd);
            
            closeButton.addEventListener('click', () => {
                document.body.removeChild(mockAd);
                this.isAdLoaded = false;
                this.loadInterstitial();
                if (callback) callback();
            });
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                if (document.body.contains(mockAd)) {
                    document.body.removeChild(mockAd);
                    this.isAdLoaded = false;
                    this.loadInterstitial();
                    if (callback) callback();
                }
            }, 5000);
            
            return;
        }
        
        // Check if ad is loaded and AdMob plugin is available
        if (this.isAdLoaded && typeof admob !== 'undefined') {
            admob.showInterstitial();
            this.isAdLoaded = false;
            
            // Reload interstitial for next time
            setTimeout(() => {
                this.loadInterstitial();
            }, 1000);
            
            // Execute callback after ad is closed
            document.addEventListener('onAdDismiss', (event) => {
                if (event.adType === admob.AD_TYPE.INTERSTITIAL) {
                    if (callback) callback();
                }
            });
        } else {
            console.warn('Interstitial ad not loaded yet');
            if (callback) callback();
        }
    }
}
