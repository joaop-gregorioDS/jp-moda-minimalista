package br.com.jpminimal

import android.app.Application
import br.com.jpminimal.data.AppContainer

class JpMinimalApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
