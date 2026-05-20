package com.meucaixa.app;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import org.json.JSONObject;
import org.json.JSONArray;

import java.io.IOException;
import java.util.ArrayList;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int VOICE_REQUEST = 1002;
    private static final int OCR_REQUEST = 1003;
    private static final int SMS_PERMISSION_REQUEST = 1004;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                } catch (Exception exception) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new VoiceBridge(), "Android");
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == VOICE_REQUEST) {
            ArrayList<String> results = data == null ? null : data.getStringArrayListExtra(android.speech.RecognizerIntent.EXTRA_RESULTS);
            String text = results == null || results.isEmpty() ? "" : results.get(0);
            sendVoiceResult(text);
            return;
        }

        if (requestCode == OCR_REQUEST) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                readImageText(data.getData());
            } else {
                sendOcrResult("");
            }
            return;
        }

        if (requestCode != FILE_CHOOSER_REQUEST || filePathCallback == null) {
            return;
        }
        Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == SMS_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                sendSmsMessages();
            } else {
                sendImportedMessages(new JSONArray());
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    private void sendVoiceResult(String text) {
        final String safeText = JSONObject.quote(text == null ? "" : text);
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript("window.handleVoiceResult(" + safeText + ")", null);
            }
        });
    }

    private void sendOcrResult(String text) {
        final String safeText = JSONObject.quote(text == null ? "" : text);
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript("window.handleOcrResult(" + safeText + ")", null);
            }
        });
    }

    private void sendImportedMessages(JSONArray messages) {
        final String payload = messages.toString();
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript("window.handleImportedMessages(" + JSONObject.quote(payload) + ")", null);
            }
        });
    }

    private void sendSmsMessages() {
        JSONArray messages = new JSONArray();
        Cursor cursor = null;
        try {
            cursor = getContentResolver().query(
                    Uri.parse("content://sms/inbox"),
                    new String[]{"body"},
                    null,
                    null,
                    "date DESC"
            );
            int count = 0;
            while (cursor != null && cursor.moveToNext() && count < 80) {
                String body = cursor.getString(0);
                if (looksFinancial(body)) {
                    messages.put(body);
                    count++;
                }
            }
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) cursor.close();
        }
        sendImportedMessages(messages);
    }

    private boolean looksFinancial(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return lower.contains("r$") || lower.contains("pix") || lower.contains("compra") || lower.contains("cartao") || lower.contains("cartão") || lower.contains("debito") || lower.contains("débito") || lower.contains("credito") || lower.contains("crédito");
    }

    public class VoiceBridge {
        @JavascriptInterface
        public void startVoiceInput() {
            Intent intent = new Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE_MODEL, android.speech.RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE, "pt-BR");
            intent.putExtra(android.speech.RecognizerIntent.EXTRA_PROMPT, "Fale o lancamento");
            try {
                startActivityForResult(intent, VOICE_REQUEST);
            } catch (Exception exception) {
                sendVoiceResult("");
            }
        }

        @JavascriptInterface
        public void startPhotoOcr() {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("image/*");
            try {
                startActivityForResult(Intent.createChooser(intent, "Escolher nota ou comprovante"), OCR_REQUEST);
            } catch (Exception exception) {
                sendOcrResult("");
            }
        }

        @JavascriptInterface
        public void importSms() {
            if (android.os.Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_SMS}, SMS_PERMISSION_REQUEST);
                return;
            }
            sendSmsMessages();
        }

        @JavascriptInterface
        public void importNotifications() {
            SharedPreferences prefs = getSharedPreferences("bank_notifications", Context.MODE_PRIVATE);
            String stored = prefs.getString("messages", "[]");
            sendImportedMessages(new JSONArrayWrapper(stored).array);
        }

        @JavascriptInterface
        public void openNotificationSettings() {
            try {
                startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS));
            } catch (Exception ignored) {
            }
        }
    }

    private void readImageText(Uri imageUri) {
        try {
            InputImage image = InputImage.fromFilePath(this, imageUri);
            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(image)
                    .addOnSuccessListener(new OnSuccessListener<Text>() {
                        @Override
                        public void onSuccess(Text text) {
                            sendOcrResult(text.getText());
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(Exception exception) {
                            sendOcrResult("");
                        }
                    });
        } catch (IOException exception) {
            sendOcrResult("");
        }
    }

    private static class JSONArrayWrapper {
        final JSONArray array;
        JSONArrayWrapper(String source) {
            JSONArray parsed;
            try {
                parsed = new JSONArray(source);
            } catch (Exception exception) {
                parsed = new JSONArray();
            }
            array = parsed;
        }
    }
}
