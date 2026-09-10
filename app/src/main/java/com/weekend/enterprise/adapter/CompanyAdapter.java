package com.weekend.enterprise.adapter;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;
import com.weekend.enterprise.R;
import com.weekend.enterprise.model.Company;

import java.util.List;

public class CompanyAdapter extends RecyclerView.Adapter<CompanyAdapter.CompanyViewHolder> {

    private final Context context;
    private List<Company> companies;
    private final OnCompanyClickListener listener;

    public interface OnCompanyClickListener {
        void onCompanyClick(int companyId);
    }

    public CompanyAdapter(Context context, List<Company> companies, OnCompanyClickListener listener) {
        this.context = context;
        this.companies = companies;
        this.listener = listener;
    }

    public void updateData(List<Company> newCompanies) {
        this.companies = newCompanies;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CompanyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_company, parent, false);
        return new CompanyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CompanyViewHolder holder, int position) {
        Company company = companies.get(position);

        holder.tvName.setText(company.getName());

        GradientDrawable logoBg = new GradientDrawable();
        logoBg.setShape(GradientDrawable.RECTANGLE);
        logoBg.setCornerRadius(12);
        logoBg.setColor(Color.parseColor(company.getColorHex()));
        holder.tvLogo.setBackground(logoBg);
        holder.tvLogo.setText(company.getLogoChar());

        holder.tvHq.setText(company.getHeadquarters());
        holder.tvFounded.setText("成立于" + company.getFounded());
        holder.tvDesc.setText(company.getDescription());
        holder.tvSizeHours.setText(company.getSize() + " · " + company.getWorkHours());

        holder.productTagsContainer.removeAllViews();
        for (String productName : company.getProductNames()) {
            TextView tag = new TextView(context);
            tag.setText(productName);
            tag.setBackgroundResource(R.drawable.bg_mini_product);
            tag.setTextColor(context.getResources().getColor(R.color.md_on_surface_variant));
            tag.setTextSize(11);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            params.setMarginEnd(8);
            tag.setPadding(28, 16, 28, 16);
            tag.setLayoutParams(params);
            holder.productTagsContainer.addView(tag);
        }

        holder.card.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCompanyClick(company.getId());
            }
        });
    }

    @Override
    public int getItemCount() {
        return companies == null ? 0 : companies.size();
    }

    static class CompanyViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView card;
        TextView tvLogo;
        TextView tvName;
        TextView tvHq;
        TextView tvFounded;
        TextView tvDesc;
        TextView tvSizeHours;
        LinearLayout productTagsContainer;

        CompanyViewHolder(@NonNull View itemView) {
            super(itemView);
            card = (MaterialCardView) itemView;
            tvLogo = itemView.findViewById(R.id.tv_company_logo);
            tvName = itemView.findViewById(R.id.tv_company_name);
            tvHq = itemView.findViewById(R.id.tv_company_hq);
            tvFounded = itemView.findViewById(R.id.tv_company_founded);
            tvDesc = itemView.findViewById(R.id.tv_company_desc);
            tvSizeHours = itemView.findViewById(R.id.tv_company_size_hours);
            productTagsContainer = itemView.findViewById(R.id.ll_product_tags);
        }
    }
}
