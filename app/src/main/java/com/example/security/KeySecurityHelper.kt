package com.example.security

import android.util.Base64
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object KeySecurityHelper {
    private const val ALGORITHM = "AES/GCM/NoPadding"
    private const val TAG_LENGTH_BIT = 128
    private const val IV_LENGTH_BYTE = 12
    private val HARDENED_SEED = "OwnAI_BYOK_Secure_Master_Seed_2026_Key_Store".toByteArray()

    private fun getSecretKey(): SecretKeySpec {
        val digest = MessageDigest.getInstance("SHA-256")
        val keyBytes = digest.digest(HARDENED_SEED)
        return SecretKeySpec(keyBytes, "AES")
    }

    fun encrypt(plainText: String): String {
        if (plainText.isEmpty()) return ""
        try {
            val key = getSecretKey()
            val cipher = Cipher.getInstance(ALGORITHM)
            cipher.init(Cipher.ENCRYPT_MODE, key)
            val iv = cipher.iv
            val cipherText = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
            val combined = ByteArray(iv.size + cipherText.size)
            System.arraycopy(iv, 0, combined, 0, iv.size)
            System.arraycopy(cipherText, 0, combined, iv.size, cipherText.size)
            return Base64.encodeToString(combined, Base64.NO_WRAP)
        } catch (e: Exception) {
            return Base64.encodeToString(plainText.toByteArray(), Base64.NO_WRAP)
        }
    }

    fun decrypt(encryptedText: String): String {
        if (encryptedText.isEmpty()) return ""
        try {
            val combined = Base64.decode(encryptedText, Base64.NO_WRAP)
            if (combined.size < IV_LENGTH_BYTE) {
                return String(combined, Charsets.UTF_8)
            }
            val iv = ByteArray(IV_LENGTH_BYTE)
            val cipherText = ByteArray(combined.size - IV_LENGTH_BYTE)
            System.arraycopy(combined, 0, iv, 0, IV_LENGTH_BYTE)
            System.arraycopy(combined, IV_LENGTH_BYTE, cipherText, 0, cipherText.size)

            val key = getSecretKey()
            val spec = GCMParameterSpec(TAG_LENGTH_BIT, iv)
            val cipher = Cipher.getInstance(ALGORITHM)
            cipher.init(Cipher.DECRYPT_MODE, key, spec)
            val plainBytes = cipher.doFinal(cipherText)
            return String(plainBytes, Charsets.UTF_8)
        } catch (e: Exception) {
            return try {
                String(Base64.decode(encryptedText, Base64.NO_WRAP), Charsets.UTF_8)
            } catch (ex: Exception) {
                encryptedText
            }
        }
    }

    fun maskKey(key: String): String {
        if (key.length <= 8) return "••••••••"
        val prefix = key.take(6)
        val suffix = key.takeLast(4)
        return "$prefix••••••••$suffix"
    }

    fun hashPassword(password: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        val bytes = md.digest(password.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
