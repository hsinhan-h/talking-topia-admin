import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import 'primeicons/primeicons.css'
const app = createApp(App);
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#ffe5e5',
            100: '#ffcccc',
            200: '#ffb2b2',
            300: '#ff9999',
            400: '#ff8080',
            500: '#ff5f5f', //TalkingTopia theme red color :)
            600: '#e65555',
            700: '#cc4c4c',
            800: '#b34444',
            900: '#993b3b',
            950: '#7a2f2f'
        },
        secondary: {
            50: '#e0f9f6',
            100: '#b3f1e9',
            200: '#80e7db',
            300: '#4ddccd',
            400: '#26d4c2',
            500: '#02cab9', // TalkingTopia theme color (湖水綠)
            600: '#02b6a7',
            700: '#02a192',
            800: '#018a7d',
            900: '#016c5e',
            950: '#004c43'
        }
    }
});

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
