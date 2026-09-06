import SwiftUI

struct SearchView: View {
    @Environment(AppModel.self) private var model
    @State private var query = ""
    @State private var results: [ProductCard] = []
    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Buscar peças…", text: $query)
                .font(TypeScale.bodyLarge)
                .foregroundStyle(Palette.ink)
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(Palette.paper)
                .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).stroke(Palette.line, lineWidth: 1))
                .tint(Palette.gold)
                .focused($focused)
                .submitLabel(.search)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()

            if query.trimmingCharacters(in: .whitespacesAndNewlines).count == 1 {
                Text("Digite ao menos 2 letras")
                    .font(TypeScale.bodyMedium)
                    .foregroundStyle(Palette.mist)
            }

            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    ForEach(results) { product in
                        Button {
                            model.openProduct(product.slug)
                        } label: {
                            HStack(spacing: 12) {
                                ProductVisualBox(motif: product.visual, colorHex: product.colorHex)
                                    .frame(width: 56, height: 56)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(product.name)
                                        .font(TypeScale.bodyLarge)
                                        .foregroundStyle(Palette.ink)
                                        .multilineTextAlignment(.leading)
                                    Text(Money.formatBRL(product.price))
                                        .font(TypeScale.bodyMedium)
                                        .foregroundStyle(Palette.mist)
                                }
                                Spacer()
                            }
                            .padding(.vertical, 8)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .padding(16)
        .background(Palette.paper)
        .onAppear { focused = true }
        .task(id: query) { await search() }
    }

    private func search() async {
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if q.count < 2 {
            results = []
            return
        }
        try? await Task.sleep(for: .milliseconds(300))
        guard !Task.isCancelled else { return }
        results = (try? await model.api.search(q)) ?? []
    }
}
