package com.weekend.enterprise;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.flexbox.FlexboxLayout;
import com.google.android.material.appbar.MaterialToolbar;
import com.weekend.enterprise.data.DataProvider;
import com.weekend.enterprise.model.Company;
import com.weekend.enterprise.model.Product;

public class ProductDetailActivity extends AppCompatActivity {

    private Product product;
    private Company company;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_detail);

        int companyId = getIntent().getIntExtra("company_id", -1);
        int productIndex = getIntent().getIntExtra("product_index", -1);

        company = DataProvider.getCompanyById(companyId);
        if (company == null || productIndex < 0 || productIndex >= company.getProducts().size()) {
            finish();
            return;
        }
        product = company.getProducts().get(productIndex);

        initViews();
    }

    private void initViews() {
        FrameLayout flHero = findViewById(R.id.fl_product_hero);
        TextView tvName = findViewById(R.id.tv_product_name);
        TextView tvCategory = findViewById(R.id.tv_product_category);
        TextView tvDesc = findViewById(R.id.tv_product_desc);
        TextView tvStatUsers = findViewById(R.id.tv_stat_users);
        TextView tvStatRating = findViewById(R.id.tv_stat_rating);
        TextView tvStatYear = findViewById(R.id.tv_stat_year);
        FlexboxLayout flFeatures = findViewById(R.id.fl_features);

        int color = Color.parseColor(product.getColorHex());
        GradientDrawable heroBg = new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{color, darker(color)}
        );
        flHero.setBackground(heroBg);

        tvName.setText(product.getName());
        tvCategory.setText(product.getCategory());
        tvDesc.setText(product.getDescription());
        tvStatUsers.setText(product.getUsers());
        tvStatRating.setText(product.getRating());
        tvStatYear.setText(product.getYear());

        flFeatures.removeAllViews();
        for (String feature : product.getFeatures()) {
            TextView chip = new TextView(this);
            chip.setText(feature);
            chip.setBackgroundResource(R.drawable.bg_feature_chip);
            chip.setTextColor(getColor(R.color.md_on_surface_variant));
            chip.setTextSize(12);
            FlexboxLayout.LayoutParams params = new FlexboxLayout.LayoutParams(
                    FlexboxLayout.LayoutParams.WRAP_CONTENT,
                    FlexboxLayout.LayoutParams.WRAP_CONTENT
            );
            params.setMargins(0, 0, 8, 8);
            chip.setPadding(24, 12, 24, 12);
            chip.setLayoutParams(params);
            flFeatures.addView(chip);
        }

        MaterialToolbar toolbar = findViewById(R.id.toolbar_product);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());
    }

    private int darker(int color) {
        float[] hsv = new float[3];
        Color.colorToHSV(color, hsv);
        hsv[2] *= 0.8f;
        return Color.HSVToColor(hsv);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }
}
