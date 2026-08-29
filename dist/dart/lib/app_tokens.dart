// GENERATED FILE — do not edit. Source: tokens/*.json, generator: build/build.ts.
//
// Consumed by the Calvary Temple Flutter app. Names mirror the app's original
// AppColors / AppSpacing / AppRadii exactly.

import 'package:flutter/material.dart';

/// Colour tokens. Source: tokens/color.json.
class AppColors {
  const AppColors._();

  static const gold400 = Color(0xFFFACC15);
  static const gold500 = Color(0xFFF59E0B);
  static const gold600 = Color(0xFFD97706);
  static const gold700 = Color(0xFFB45309);
  static const neutral50 = Color(0xFFF9FAFB);
  static const neutral100 = Color(0xFFF3F4F6);
  static const neutral200 = Color(0xFFE5E7EB);
  static const neutral300 = Color(0xFFD1D5DB);
  static const neutral500 = Color(0xFF6B7280);
  static const neutral600 = Color(0xFF4B5563);
  static const neutral700 = Color(0xFF374151);
  static const neutral800 = Color(0xFF1F2937);
  static const neutral900 = Color(0xFF111827);
  static const success = Color(0xFF16A34A);
  static const warning = Color(0xFFF59E0B);
  static const danger = Color(0xFFDC2626);
  static const info = Color(0xFF0284C7);
  static const onGold = Color(0xFF451A03);
  static const espresso = Color(0xFF292018);
  static const chipInfoBg = Color(0xFFF3F4F6);
  static const chipInfoFg = Color(0xFF374151);
  static const chipSuccessBg = Color(0xFFDCFCE7);
  static const chipSuccessFg = Color(0xFF166534);
  static const chipWarningBg = Color(0xFFFEF3C7);
  static const chipWarningFg = Color(0xFF92400E);
  static const chipDangerBg = Color(0xFFFEE2E2);
  static const chipDangerFg = Color(0xFF991B1B);

  static const goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFACC15), Color(0xFFD97706)],
  );

  static const splashRadial = RadialGradient(
    center: Alignment(0, -0.4),
    radius: 1.2,
    colors: [Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFFD97706)],
    stops: [0.00, 0.55, 1.00],
  );
}

/// Spacing scale. Source: tokens/spacing.json.
class AppSpacing {
  const AppSpacing._();

  static const double s1 = 4;
  static const double s2 = 8;
  static const double s3 = 12;
  static const double s4 = 16;
  static const double s5 = 20;
  static const double s6 = 24;
  static const double s8 = 32;
  static const double s10 = 40;
}

/// Screen frame constants. Source: tokens/spacing.json "frame".
class AppFrame {
  const AppFrame._();

  static const double screenInset = 16;
  static const double bottomNavHeight = 64;
}

/// Corner radii. Source: tokens/radii.json.
class AppRadii {
  const AppRadii._();

  static const Radius sm = Radius.circular(6);
  static const Radius md = Radius.circular(10);
  static const Radius lg = Radius.circular(14);
  static const Radius xl = Radius.circular(20);
  static const Radius pill = Radius.circular(999);

  static const BorderRadius smAll = BorderRadius.all(sm);
  static const BorderRadius mdAll = BorderRadius.all(md);
  static const BorderRadius lgAll = BorderRadius.all(lg);
  static const BorderRadius xlAll = BorderRadius.all(xl);
  static const BorderRadius pillAll = BorderRadius.all(pill);
}

/// Which family a text token asks for. The app resolves this to a real font;
/// the body family falls back to Montserrat on Flutter — see
/// tokens/typography.json.
enum AppFontFamily { display, body }

/// A type-scale entry as raw values. Building the TextStyle stays in the app,
/// because font delivery differs per platform.
@immutable
class AppTextToken {
  const AppTextToken({
    required this.family,
    required this.size,
    required this.weight,
    required this.lineHeight,
  });

  final AppFontFamily family;
  final double size;
  final int weight;
  final double lineHeight;
}

/// Mobile type scale. Source: tokens/typography.json.
class AppTextTokens {
  const AppTextTokens._();

  static const displayLg = AppTextToken(
    family: AppFontFamily.display,
    size: 32.0,
    weight: 700,
    lineHeight: 1.15,
  );
  static const displayMd = AppTextToken(
    family: AppFontFamily.display,
    size: 26.0,
    weight: 700,
    lineHeight: 1.2,
  );
  static const displaySm = AppTextToken(
    family: AppFontFamily.display,
    size: 22.0,
    weight: 600,
    lineHeight: 1.25,
  );
  static const titleLg = AppTextToken(
    family: AppFontFamily.body,
    size: 20.0,
    weight: 600,
    lineHeight: 1.3,
  );
  static const titleMd = AppTextToken(
    family: AppFontFamily.body,
    size: 18.0,
    weight: 600,
    lineHeight: 1.35,
  );
  static const titleSm = AppTextToken(
    family: AppFontFamily.body,
    size: 16.0,
    weight: 600,
    lineHeight: 1.4,
  );
  static const bodyLg = AppTextToken(
    family: AppFontFamily.body,
    size: 16.0,
    weight: 400,
    lineHeight: 1.5,
  );
  static const bodyMd = AppTextToken(
    family: AppFontFamily.body,
    size: 14.0,
    weight: 400,
    lineHeight: 1.5,
  );
  static const bodySm = AppTextToken(
    family: AppFontFamily.body,
    size: 13.0,
    weight: 400,
    lineHeight: 1.45,
  );
  static const labelLg = AppTextToken(
    family: AppFontFamily.body,
    size: 14.0,
    weight: 600,
    lineHeight: 1.3,
  );
  static const labelMd = AppTextToken(
    family: AppFontFamily.body,
    size: 12.0,
    weight: 600,
    lineHeight: 1.3,
  );
  static const caption = AppTextToken(
    family: AppFontFamily.body,
    size: 11.0,
    weight: 500,
    lineHeight: 1.3,
  );
}
