import SwiftUI

struct LoginView: View {
    @Environment(AppModel.self) private var model
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text("Entrar")
                    .font(TypeScale.headlineMedium)
                    .foregroundStyle(Palette.ink)
                JPField(title: "E-mail", text: $email, keyboard: .emailAddress, autocapitalization: .never)
                JPField(title: "Senha", text: $password, isSecure: true)
                if let err = model.session.authError {
                    Text(err)
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.error)
                }
                JpButton(title: model.session.busy ? "Entrando…" : "Entrar", enabled: !model.session.busy) {
                    Task {
                        if await model.session.login(email: email, password: password) {
                            model.pop()
                        }
                    }
                }
                Button("Criar conta") { model.openRegister() }
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.ink)
                    .buttonStyle(.plain)
                Text("Demo: demo@jpstore.com.br / demo1234")
                    .font(TypeScale.bodyMedium)
                    .foregroundStyle(Palette.mist)
            }
            .padding(16)
        }
        .background(Palette.paper)
        .scrollDismissesKeyboard(.interactively)
        .onAppear { model.session.authError = nil }
    }
}

struct RegisterView: View {
    @Environment(AppModel.self) private var model
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var phone = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text("Cadastro")
                    .font(TypeScale.headlineMedium)
                    .foregroundStyle(Palette.ink)
                JPField(title: "Nome", text: $name, autocapitalization: .words)
                JPField(title: "E-mail", text: $email, keyboard: .emailAddress, autocapitalization: .never)
                JPField(title: "Telefone", text: $phone, keyboard: .phonePad)
                JPField(title: "Senha (mín. 6)", text: $password, isSecure: true)
                if let err = model.session.authError {
                    Text(err)
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.error)
                }
                JpButton(title: model.session.busy ? "Cadastrando…" : "Cadastrar", enabled: !model.session.busy) {
                    Task {
                        if await model.session.register(name: name, email: email, password: password, phone: phone) {
                            model.pop()
                            model.pop()
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Palette.paper)
        .scrollDismissesKeyboard(.interactively)
        .onAppear { model.session.authError = nil }
    }
}
