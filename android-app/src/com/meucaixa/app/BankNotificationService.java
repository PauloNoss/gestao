package com.meucaixa.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import org.json.JSONArray;

public class BankNotificationService extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        CharSequence title = sbn.getNotification().extras.getCharSequence("android.title");
        CharSequence text = sbn.getNotification().extras.getCharSequence("android.text");
        String message = ((title == null ? "" : title.toString()) + " " + (text == null ? "" : text.toString())).trim();
        if (!looksFinancial(message)) return;

        SharedPreferences prefs = getSharedPreferences("bank_notifications", Context.MODE_PRIVATE);
        JSONArray array;
        try {
            array = new JSONArray(prefs.getString("messages", "[]"));
        } catch (Exception exception) {
            array = new JSONArray();
        }
        JSONArray next = new JSONArray();
        next.put(message);
        for (int i = 0; i < array.length() && i < 79; i += 1) {
            next.put(array.optString(i));
        }
        prefs.edit().putString("messages", next.toString()).apply();
    }

    private boolean looksFinancial(String text) {
        String lower = text == null ? "" : text.toLowerCase();
        return lower.contains("r$") || lower.contains("pix") || lower.contains("compra") || lower.contains("cartao") || lower.contains("cartão") || lower.contains("debito") || lower.contains("débito") || lower.contains("credito") || lower.contains("crédito");
    }
}
