import SwiftUI
import UIKit

struct JPWordmark: View {
    var body: some View {
        HStack(spacing: 0) {
            Text("JP")
                .font(TypeScale.wordmark)
                .tracking(1)
                .foregroundStyle(Palette.gold)
            Text("  MINIMAL")
                .font(TypeScale.wordmark)
                .tracking(1)
                .foregroundStyle(Palette.ink)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("JP Minimal")
    }
}

struct DemoBanner: View {
    var body: some View {
        Text("Loja de portfólio — pagamentos simulados")
            .font(TypeScale.labelSmall)
            .tracking(1.6)
            .foregroundStyle(Palette.mist)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Palette.sand)
    }
}

struct ProductVisualBox: View {
    var motif: String
    var colorHex: String
    var corner: CGFloat = 16

    var body: some View {
        let visual = ProductEmoji.visual(for: motif)
        GeometryReader { geo in
            ZStack {
                Color(hex: colorHex)
                Text(visual.emoji)
                    .font(.system(size: max(28, min(geo.size.width, geo.size.height) * 0.42 * visual.scale)))
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: corner, style: .continuous))
    }
}

struct BadgeChip: View {
    var text: String
    var filled: Bool = true

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 10, weight: .semibold))
            .foregroundStyle(filled ? Palette.paper : Palette.ink)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                Capsule().fill(filled ? Palette.ink : Palette.paper.opacity(0.9))
            )
    }
}

struct ProductCardView: View {
    let product: ProductCard
    var onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                ZStack(alignment: .topLeading) {
                    ProductVisualBox(motif: product.visual, colorHex: product.colorHex)
                        .aspectRatio(1, contentMode: .fit)
                    HStack(spacing: 6) {
                        if let pct = product.discountPct {
                            BadgeChip(text: "\(pct)% off")
                        }
                        if !product.inStock {
                            BadgeChip(text: "Esgotado", filled: false)
                        }
                    }
                    .padding(10)
                }
                Text(product.categoryName.uppercased())
                    .font(TypeScale.labelSmall)
                    .tracking(1.6)
                    .foregroundStyle(Palette.mist)
                    .padding(.horizontal, 12)
                    .padding(.top, 6)
                Text(product.name)
                    .font(TypeScale.titleMedium)
                    .tracking(0.2)
                    .foregroundStyle(Palette.ink)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                    .padding(.horizontal, 12)
                    .padding(.top, 2)
                HStack(spacing: 8) {
                    Text(Money.formatBRL(product.price))
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.ink)
                    if let compare = product.compareAtPrice, compare > product.price {
                        Text(Money.formatBRL(compare))
                            .font(TypeScale.bodySmall)
                            .foregroundStyle(Palette.mist)
                            .strikethrough()
                    }
                }
                .padding(.horizontal, 12)
                .padding(.top, 4)
                .padding(.bottom, 12)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white.opacity(0.7), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct LoadingBlock: View {
    var label: String = "Carregando…"

    var body: some View {
        VStack(spacing: 12) {
            ProgressView()
                .tint(Palette.gold)
            Text(label)
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.mist)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(32)
    }
}

struct ErrorBlock: View {
    var message: String
    var onRetry: () -> Void

    var body: some View {
        VStack(spacing: 8) {
            Text(message)
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.mist)
                .multilineTextAlignment(.center)
            Button("Tentar de novo", action: onRetry)
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.gold)
                .buttonStyle(.plain)
        }
        .frame(maxWidth: .infinity)
        .padding(24)
    }
}

struct JpFilterChip: View {
    var label: String
    var selected: Bool
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(TypeScale.bodyMedium)
                .foregroundStyle(selected ? Palette.paper : Palette.ink)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? Palette.ink : Palette.paper, in: Capsule())
                .overlay(Capsule().stroke(selected ? Palette.ink : Palette.line, lineWidth: 1))
        }
        .buttonStyle(.plain)
        .tint(Palette.ink)
    }
}

struct JpButton: View {
    var title: String
    var enabled: Bool = true
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title.uppercased())
                .font(TypeScale.labelLarge)
                .tracking(1.4)
                .foregroundStyle(Palette.paper)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(enabled ? Palette.ink : Palette.ink.opacity(0.35), in: Capsule())
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .tint(Palette.ink)
    }
}

struct JPField: View {
    var title: String
    @Binding var text: String
    var keyboard: UIKeyboardType = .default
    var isSecure: Bool = false
    var autocapitalization: TextInputAutocapitalization = .sentences

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(TypeScale.labelSmall)
                .tracking(1.6)
                .foregroundStyle(Palette.mist)
            Group {
                if isSecure {
                    SecureField(title, text: $text)
                } else {
                    TextField(title, text: $text)
                        .textInputAutocapitalization(autocapitalization)
                        .keyboardType(keyboard)
                }
            }
            .font(TypeScale.bodyLarge)
            .foregroundStyle(Palette.ink)
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(Palette.paper)
            .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).stroke(Palette.line, lineWidth: 1))
            .tint(Palette.gold)
        }
    }
}

struct JPToolbarModifier: ViewModifier {
    var showSearch: Bool = true
    var onSearch: () -> Void

    func body(content: Content) -> some View {
        content
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Palette.paper, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .principal) { JPWordmark() }
                if showSearch {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button(action: onSearch) {
                            Image(systemName: "magnifyingglass")
                                .foregroundStyle(Palette.ink)
                        }
                        .accessibilityLabel("Buscar")
                    }
                }
            }
    }
}

extension View {
    func jpToolbar(showSearch: Bool = true, onSearch: @escaping () -> Void) -> some View {
        modifier(JPToolbarModifier(showSearch: showSearch, onSearch: onSearch))
    }
}
