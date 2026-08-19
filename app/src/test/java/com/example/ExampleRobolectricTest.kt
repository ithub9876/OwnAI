package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.security.KeySecurityHelper
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

    @Test
    fun `read string from context`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("OwnAI", appName)
    }

    @Test
    fun `test AES GCM encryption and decryption`() {
        val rawApiKey = "nvapi-sample-key-token-secret-9999"
        val encrypted = KeySecurityHelper.encrypt(rawApiKey)
        assertNotEquals(rawApiKey, encrypted)

        val decrypted = KeySecurityHelper.decrypt(encrypted)
        assertEquals(rawApiKey, decrypted)
    }

    @Test
    fun `test API key masking`() {
        val rawApiKey = "sk-ant-api03-abcdefghijklmnop1234"
        val masked = KeySecurityHelper.maskKey(rawApiKey)
        assertTrue(masked.contains("••••••••"))
        assertTrue(masked.endsWith("1234"))
    }

    @Test
    fun `test password hashing`() {
        val hash1 = KeySecurityHelper.hashPassword("secret123")
        val hash2 = KeySecurityHelper.hashPassword("secret123")
        val hash3 = KeySecurityHelper.hashPassword("different")
        assertEquals(hash1, hash2)
        assertNotEquals(hash1, hash3)
    }
}
