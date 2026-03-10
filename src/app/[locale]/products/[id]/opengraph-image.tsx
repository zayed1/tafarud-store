import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "Product Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name_ar, name_en, price, image_url")
    .eq("id", id)
    .single();

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0A6658, #0D8070, #5EC4B0)",
            color: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          متجر التفرّد
        </div>
      ),
      { ...size }
    );
  }

  const name = locale === "ar" ? product.name_ar : product.name_en || product.name_ar;
  const price = `${product.price} AED`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0A6658 0%, #0D8070 50%, #5EC4B0 100%)",
          padding: "60px",
          alignItems: "center",
          gap: "50px",
        }}
      >
        {/* Product image */}
        {product.image_url && (
          <div
            style={{
              display: "flex",
              width: "340px",
              height: "510px",
              borderRadius: "20px",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Product info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              ت
            </div>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "20px" }}>
              متجر التفرّد
            </span>
          </div>

          <div
            style={{
              fontSize: "46px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              direction: locale === "ar" ? "rtl" : "ltr",
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255,255,255,0.15)",
              padding: "14px 24px",
              borderRadius: "16px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {price}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
