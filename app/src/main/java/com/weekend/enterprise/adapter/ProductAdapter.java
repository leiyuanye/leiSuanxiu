package com.weekend.enterprise.adapter;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.weekend.enterprise.R;
import com.weekend.enterprise.model.Product;

import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private final Context context;
    private final List<Product> products;
    private final OnProductClickListener listener;

    public interface OnProductClickListener {
        void onProductClick(int position);
    }

    public ProductAdapter(Context context, List<Product> products, OnProductClickListener listener) {
        this.context = context;
        this.products = products;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_product, parent, false);
        return new ProductViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        Product product = products.get(position);

        holder.tvName.setText(product.getName());
        holder.tvCategory.setText(product.getCategory());
        holder.tvDesc.setText(product.getDescription());
        holder.tvRating.setText(product.getRating());
        holder.tvUsers.setText(product.getUsers() + " 用户");

        int color = Color.parseColor(product.getColorHex());
        GradientDrawable bg = new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{color, darker(color)}
        );
        bg.setCornerRadius(0);
        holder.flImage.setBackground(bg);

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onProductClick(position);
            }
        });
    }

    private int darker(int color) {
        float[] hsv = new float[3];
        Color.colorToHSV(color, hsv);
        hsv[2] *= 0.8f;
        return Color.HSVToColor(hsv);
    }

    @Override
    public int getItemCount() {
        return products == null ? 0 : products.size();
    }

    static class ProductViewHolder extends RecyclerView.ViewHolder {
        FrameLayout flImage;
        TextView tvName;
        TextView tvCategory;
        TextView tvDesc;
        TextView tvRating;
        TextView tvUsers;

        ProductViewHolder(@NonNull View itemView) {
            super(itemView);
            flImage = itemView.findViewById(R.id.fl_product_image);
            tvName = itemView.findViewById(R.id.tv_product_name);
            tvCategory = itemView.findViewById(R.id.tv_product_category);
            tvDesc = itemView.findViewById(R.id.tv_product_desc);
            tvRating = itemView.findViewById(R.id.tv_product_rating);
            tvUsers = itemView.findViewById(R.id.tv_product_users);
        }
    }
}
