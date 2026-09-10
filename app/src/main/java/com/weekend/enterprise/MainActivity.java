package com.weekend.enterprise;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.weekend.enterprise.adapter.CompanyAdapter;
import com.weekend.enterprise.data.DataProvider;
import com.weekend.enterprise.model.Company;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity implements CompanyAdapter.OnCompanyClickListener {

    private RecyclerView rvCompanies;
    private CompanyAdapter adapter;
    private TextInputEditText etSearch;
    private ChipGroup chipGroup;
    private BottomNavigationView bottomNav;

    private String currentFilter = "全部";
    private String currentQuery = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupRecyclerView();
        setupSearch();
        setupChips();
        setupBottomNav();
    }

    private void initViews() {
        rvCompanies = findViewById(R.id.rv_companies);
        etSearch = findViewById(R.id.edit_search);
        chipGroup = findViewById(R.id.chip_group);
        bottomNav = findViewById(R.id.bottom_nav);
    }

    private void setupRecyclerView() {
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        rvCompanies.setLayoutManager(layoutManager);
        adapter = new CompanyAdapter(this, DataProvider.getCompanies(), this);
        rvCompanies.setAdapter(adapter);
    }

    private void setupSearch() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                currentQuery = s.toString().toLowerCase(Locale.getDefault()).trim();
                filterCompanies();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void setupChips() {
        chipGroup.setOnCheckedStateChangeListener((group, checkedIds) -> {
            if (checkedIds.isEmpty()) return;
            Chip checkedChip = findViewById(checkedIds.get(0));
            currentFilter = checkedChip.getText().toString();
            filterCompanies();
        });
    }

    private void filterCompanies() {
        List<Company> all = DataProvider.getCompanies();
        List<Company> filtered = new ArrayList<>();

        for (Company c : all) {
            boolean matchesIndustry = currentFilter.equals("全部") || c.getIndustry().equals(currentFilter);

            boolean matchesQuery = true;
            if (!currentQuery.isEmpty()) {
                matchesQuery = c.getName().toLowerCase(Locale.getDefault()).contains(currentQuery)
                        || c.getDescription().toLowerCase(Locale.getDefault()).contains(currentQuery)
                        || c.getProductNames().toString().toLowerCase(Locale.getDefault()).contains(currentQuery);
            }

            if (matchesIndustry && matchesQuery) {
                filtered.add(c);
            }
        }

        adapter.updateData(filtered);
    }

    private void setupBottomNav() {
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                return true;
            } else {
                return false;
            }
        });
    }

    @Override
    public void onCompanyClick(int companyId) {
        Intent intent = new Intent(this, CompanyDetailActivity.class);
        intent.putExtra("company_id", companyId);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }
}
