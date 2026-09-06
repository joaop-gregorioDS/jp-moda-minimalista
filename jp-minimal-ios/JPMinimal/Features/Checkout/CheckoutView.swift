import SwiftUI

struct CheckoutView: View {
    @Environment(AppModel.self) private var model

    @State private var name = ""
    @State private var email = ""
    @State private var street = ""
    @State private var number = ""
    @State private var complement = ""
    @State private var city = ""
    @State private var state = ""
    @State private var zip = ""
    @State private var delivery = "entrega"
    @State private var payment = "pix"
    @State private var cardNumber = ""
    @State private var cardName = ""
    @State private var cardExpiry = ""
    @State private var cardCvv = ""
    @State private var placing = false
    @State private var error: String?
    @State private var placedId: Int?

    private var pickup: Bool { delivery == "retirada" }
    private var subtotal: Double { model.bag.subtotal }
    private var shipping: Double { Money.shippingFor(subtotal: subtotal, pickup: pickup) }
    private var discount: Double { Money.paymentDiscount(subtotal: subtotal, payment: payment, pickup: pickup) }
    private var total: Double { max(0, subtotal + shipping - discount) }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text("Checkout")
                    .font(TypeScale.headlineMedium)
                    .foregroundStyle(Palette.ink)
                Text("Pagamento simulado — nenhuma cobrança real.")
                    .font(TypeScale.bodyMedium)
                    .foregroundStyle(Palette.mist)

                if let placedId {
                    success(placedId)
                } else {
                    form
                }
            }
            .padding(16)
            .padding(.bottom, 32)
        }
        .background(Palette.paper)
        .scrollDismissesKeyboard(.interactively)
        .onAppear {
            if let user = model.session.user {
                if name.isEmpty { name = user.name }
                if email.isEmpty { email = user.email }
            }
        }
        .onChange(of: model.session.user?.email) { _, _ in
            if let user = model.session.user {
                name = user.name
                email = user.email
            }
        }
    }

    @ViewBuilder
    private func success(_ id: Int) -> some View {
        Text("Pedido #\(id) registrado.")
            .font(TypeScale.titleLarge)
            .foregroundStyle(Palette.goldDark)
        if payment == "pix" {
            Text("Pix (simulado): pix@jpstore.com.br")
                .font(TypeScale.bodyLarge)
                .foregroundStyle(Palette.ink)
        }
        if payment == "boleto" {
            Text("Boleto gerado (simulado). Vencimento em 3 dias.")
                .font(TypeScale.bodyLarge)
                .foregroundStyle(Palette.ink)
        }
        JpButton(title: "Ver pedidos") {
            model.openOrders()
        }
        .padding(.top, 8)
    }

    @ViewBuilder
    private var form: some View {
        HStack(spacing: 8) {
            JpFilterChip(label: "Entrega", selected: !pickup) { delivery = "entrega" }
            JpFilterChip(label: "Retirada", selected: pickup) { delivery = "retirada" }
        }

        JPField(title: "Nome", text: $name, autocapitalization: .words)
        JPField(title: "E-mail", text: $email, keyboard: .emailAddress, autocapitalization: .never)

        if !pickup {
            JPField(title: "CEP", text: $zip, keyboard: .numberPad)
            JPField(title: "Rua", text: $street, autocapitalization: .words)
            JPField(title: "Número", text: $number, keyboard: .numbersAndPunctuation)
            JPField(title: "Complemento", text: $complement)
            JPField(title: "Cidade", text: $city, autocapitalization: .words)
            JPField(title: "UF", text: $state, autocapitalization: .characters)
        } else {
            Text("Retirada na loja física — São Paulo/SP (demo).")
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.mist)
        }

        Text("Pagamento")
            .font(TypeScale.titleMedium)
            .foregroundStyle(Palette.ink)
            .padding(.top, 8)

        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                JpFilterChip(label: "Pix 5% off", selected: payment == "pix") { payment = "pix" }
                JpFilterChip(label: "Cartão", selected: payment == "cartao") { payment = "cartao" }
                JpFilterChip(label: "Boleto 5% off", selected: payment == "boleto") { payment = "boleto" }
            }
        }

        if payment == "cartao" {
            JPField(title: "Número do cartão", text: $cardNumber, keyboard: .numberPad)
            JPField(title: "Nome no cartão", text: $cardName, autocapitalization: .words)
            HStack(spacing: 8) {
                JPField(title: "Validade", text: $cardExpiry)
                JPField(title: "CVV", text: $cardCvv, keyboard: .numberPad)
            }
            Text("Dados não são enviados à API.")
                .font(TypeScale.bodySmall)
                .foregroundStyle(Palette.mist)
        }

        VStack(alignment: .leading, spacing: 4) {
            Text("Subtotal \(Money.formatBRL(subtotal))")
                .foregroundStyle(Palette.ink)
            Text("Frete \(shipping == 0 ? "Grátis" : Money.formatBRL(shipping))")
                .foregroundStyle(Palette.ink)
            if discount > 0 {
                Text("Desconto −\(Money.formatBRL(discount))")
                    .foregroundStyle(Palette.goldDark)
            }
            Text("Total \(Money.formatBRL(total))")
                .font(TypeScale.titleLarge)
                .foregroundStyle(Palette.ink)
                .padding(.top, 4)
        }
        .font(TypeScale.bodyLarge)

        if let error {
            Text(error)
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.error)
        }

        JpButton(
            title: placing ? "Enviando…" : "Finalizar pedido",
            enabled: !placing && !model.bag.items.isEmpty
        ) {
            Task { await place() }
        }
        .padding(.top, 8)
    }

    private func place() async {
        placing = true
        error = nil
        let address: OrderAddress
        if pickup {
            address = OrderAddress(
                street: "Retirada na loja",
                number: "",
                complement: "Loja demo",
                city: "São Paulo",
                state: "SP",
                zip: "00000-000"
            )
        } else {
            address = OrderAddress(
                street: street.trimmingCharacters(in: .whitespacesAndNewlines),
                number: number.trimmingCharacters(in: .whitespacesAndNewlines),
                complement: complement.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                    ? nil : complement.trimmingCharacters(in: .whitespacesAndNewlines),
                city: city.trimmingCharacters(in: .whitespacesAndNewlines),
                state: state.trimmingCharacters(in: .whitespacesAndNewlines),
                zip: zip.trimmingCharacters(in: .whitespacesAndNewlines)
            )
        }
        let body = PlaceOrderBody(
            name: name.trimmingCharacters(in: .whitespacesAndNewlines),
            email: email.trimmingCharacters(in: .whitespacesAndNewlines),
            items: model.bag.items.map {
                OrderItem(
                    productId: $0.productId,
                    productName: $0.name,
                    price: $0.price,
                    quantity: $0.quantity,
                    color: $0.colorName,
                    size: $0.size,
                    visual: $0.visual
                )
            },
            address: address,
            subtotal: subtotal,
            shipping: shipping,
            discount: discount
        )
        do {
            let order = try await model.api.placeOrder(body)
            model.bag.clear()
            placedId = order.id
        } catch {
            self.error = APIClient.friendly(error)
        }
        placing = false
    }
}
