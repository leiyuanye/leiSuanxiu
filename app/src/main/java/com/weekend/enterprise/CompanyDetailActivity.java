package com.weekend.enterprise;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.tabs.TabLayout;
import com.weekend.enterprise.adapter.ProductAdapter;
import com.weekend.enterprise.data.DataProvider;
import com.weekend.enterprise.model.Company;
import com.weekend.enterprise.model.Product;
import com.weekend.enterprise.model.TimelineEvent;

import java.util.List;

public class CompanyDetailActivity extends AppCompatActivity implements ProductAdapter.OnProductClickListener {

    private Company company;
    private List<Product> products;

    private View contentTimeline;
    private View contentProducts;
    private View contentInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_company_detail);

        int companyId = getIntent().getIntExtra("company_id", -1);
        company = DataProvider.getCompanyById(companyId);
        if (company == null) {
            finish();
            return;
        }

        products = company.getProducts();

        initViews();
        setupHeader();
        setupTimeline();
        setupProducts();
        setupInfo();
        setupTabs();
        setupFab();
    }

    private void initViews() {
        contentTimeline = findViewById(R.id.content_timeline);
        contentProducts = findViewById(R.id.content_products);
        contentInfo = findViewById(R.id.content_info);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_detail);
        toolbar.setNavigationOnClickListener(v -> {
            onBackPressed();
        });
    }

    private void setupHeader() {
        TextView tvLogo = findViewById(R.id.tv_detail_logo);
        TextView tvName = findViewById(R.id.tv_detail_name);
        TextView tvTagline = findViewById(R.id.tv_detail_tagline);

        GradientDrawable logoBg = new GradientDrawable();
        logoBg.setShape(GradientDrawable.RECTANGLE);
        logoBg.setCornerRadius(12);
        logoBg.setColor(Color.parseColor(company.getColorHex()));
        tvLogo.setBackground(logoBg);
        tvLogo.setText(company.getLogoChar());
        tvName.setText(company.getName());
        tvTagline.setText(company.getTagline());

        CollapsingToolbarLayout collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        collapsingToolbar.setTitle(company.getName());
    }

    private void setupTimeline() {
        LinearLayout container = contentTimeline.findViewById(R.id.ll_timeline_container);
        container.removeAllViews();

        List<TimelineEvent> timeline = company.getTimeline();
        for (int i = 0; i < timeline.size(); i++) {
            TimelineEvent event = timeline.get(i);
            View itemView = getLayoutInflater().inflate(R.layout.item_timeline, container, false);

            View dot = itemView.findViewById(R.id.view_timeline_dot);
            if (i == 0) {
                dot.setBackgroundResource(R.drawable.timeline_dot_first);
            } else {
                dot.setBackgroundResource(R.drawable.timeline_dot);
            }

            ((TextView) itemView.findViewById(R.id.tv_timeline_year)).setText(event.getYear());
            ((TextView) itemView.findViewById(R.id.tv_timeline_title)).setText(event.getTitle());
            ((TextView) itemView.findViewById(R.id.tv_timeline_desc)).setText(event.getDescription());

            container.addView(itemView);
        }
    }

    private void setupProducts() {
        RecyclerView rvProducts = contentProducts.findViewById(R.id.rv_products);
        rvProducts.setLayoutManager(new LinearLayoutManager(this));
        rvProducts.setNestedScrollingEnabled(false);
        ProductAdapter adapter = new ProductAdapter(this, products, this);
        rvProducts.setAdapter(adapter);
    }

    private void setupInfo() {
        ((TextView) contentInfo.findViewById(R.id.tv_info_founded)).setText(company.getFounded());
        ((TextView) contentInfo.findViewById(R.id.tv_info_hq)).setText(company.getHeadquarters());
        ((TextView) contentInfo.findViewById(R.id.tv_info_industry)).setText(company.getIndustry());
        ((TextView) contentInfo.findViewById(R.id.tv_info_size)).setText(company.getSize());
        ((TextView) contentInfo.findViewById(R.id.tv_info_ipo)).setText(company.getIpoStatus());
        ((TextView) contentInfo.findViewById(R.id.tv_info_work_hours)).setText(company.getWorkHours());
        ((TextView) contentInfo.findViewById(R.id.tv_info_overtime)).setText(company.getOvertime());
        ((TextView) contentInfo.findViewById(R.id.tv_info_leave)).setText(company.getAnnualLeave());
        ((TextView) contentInfo.findViewById(R.id.tv_company_intro)).setText(company.getDescription());
    }

    private void setupTabs() {
        TabLayout tabLayout = findViewById(R.id.tab_layout);
        tabLayout.addTab(tabLayout.newTab().setText(R.string.tab_timeline));
        tabLayout.addTab(tabLayout.newTab().setText(R.string.tab_products));
        tabLayout.addTab(tabLayout.newTab().setText(R.string.tab_info));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        showContent(contentTimeline);
                        break;
                    case 1:
                        showContent(contentProducts);
                        break;
                    case 2:
                        showContent(contentInfo);
                        break;
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}

            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void showContent(View visibleContent) {
        contentTimeline.setVisibility(View.GONE);
        contentProducts.setVisibility(View.GONE);
        contentInfo.setVisibility(View.GONE);
        visibleContent.setVisibility(View.VISIBLE);
    }

    private void setupFab() {
        FloatingActionButton fab = findViewById(R.id.fab_favorite);
        fab.setOnClickListener(v ->
            Toast.makeText(this, "收藏功能开发中", Toast.LENGTH_SHORT).show()
        );
    }

    @Override
    public void onProductClick(int position) {
        Intent intent = new Intent(this, ProductDetailActivity.class);
        intent.putExtra("company_id", company.getId());
        intent.putExtra("product_index", position);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }
}
